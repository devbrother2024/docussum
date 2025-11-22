'use server'

import genAI from '@/lib/gemini/client'
import { db } from '@/db'
import { summaries, users } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { Content, Part } from '@google/genai'

interface SummaryResult {
    tldr: string
    content: string
}

interface ActionResponse {
    success: boolean
    data?: SummaryResult
    error?: string
}

export async function generateSummary(
    content: string,
    type: 'text' | 'youtube' = 'text'
): Promise<ActionResponse> {
    try {
        if (!content) {
            return { success: false, error: 'Content is required' }
        }

        // Define the response schema for structured output
        const responseSchema = {
            type: 'OBJECT',
            properties: {
                tldr: {
                    type: 'STRING',
                    description:
                        'A concise 3-bullet point summary of the content.'
                },
                content: {
                    type: 'STRING',
                    description:
                        'A detailed summary of the content in Markdown format.'
                }
            },
            required: ['tldr', 'content']
        }

        let contents: Content[] = []

        if (type === 'text') {
            contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Summarize the following text in Korean:\n\n${content}`
                        }
                    ]
                }
            ]
        } else if (type === 'youtube') {
            // YouTube URL Validation
            const youtubeRegex =
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
            if (!youtubeRegex.test(content)) {
                return { success: false, error: 'Invalid YouTube URL' }
            }

            const videoPart: Part = {
                fileData: {
                    fileUri: content,
                    mimeType: 'video/mp4' // Gemini API treats YouTube URLs as video inputs
                }
            }

            contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: 'Summarize this video into a TL;DR and a detailed Markdown content in Korean.'
                        },
                        videoPart
                    ]
                }
            ]
        }

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: contents,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema
            }
        })

        const resultText = response.text || null
        if (!resultText) {
            throw new Error('No response from Gemini')
        }

        const parsedResult = JSON.parse(resultText) as SummaryResult

        // === Save to Database ===
        // Note: In Epic 3 (Auth), we will use the actual logged-in user ID.
        // For now, we'll use a placeholder or create a temporary guest user if needed.

        const DEMO_EMAIL = 'demo@docusumm.com'
        let userId = ''

        // Check if demo user exists
        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, DEMO_EMAIL))

        if (existingUsers.length > 0) {
            userId = existingUsers[0].id
        } else {
            console.warn('No demo user found. Skipping DB save for now.')
        }

        if (userId) {
            await db.insert(summaries).values({
                userId: userId,
                type: type,
                originalContent: content,
                tldr: parsedResult.tldr,
                content: parsedResult.content
            })

            // Refresh dashboard/history
            revalidatePath('/dashboard')
        }

        return {
            success: true,
            data: parsedResult
        }
    } catch (error) {
        console.error('Summary generation failed:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to generate summary'
        }
    }
}
