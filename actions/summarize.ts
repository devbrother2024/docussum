'use server'

import genAI from '@/lib/gemini/client'
import { db } from '@/db'
import { summaries, users } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { Content, Part } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { sendSummaryEmail } from './send-email'

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
        // Get the authenticated user
        const supabase = await createClient()
        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                error: '인증이 필요합니다. 로그인해주세요.'
            }
        }

        // Check if user exists in public.users table
        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id))

        if (existingUsers.length === 0) {
            // User might not have been created yet (should be handled by trigger, but just in case)
            return {
                success: false,
                error: '사용자 정보를 찾을 수 없습니다.'
            }
        }

        // Check credits
        const userData = existingUsers[0]
        if (userData.credits < 1) {
            return {
                success: false,
                error: '크레딧이 부족합니다. 크레딧을 충전해주세요.'
            }
        }

        // Save summary
        const [insertedSummary] = await db
            .insert(summaries)
            .values({
                userId: user.id,
                type: type,
                originalContent: content,
                tldr: parsedResult.tldr,
                content: parsedResult.content
            })
            .returning()

        // Deduct credit
        await db
            .update(users)
            .set({ credits: userData.credits - 1 })
            .where(eq(users.id, user.id))

        // Send email notification (non-blocking)
        sendSummaryEmail({
            to: userData.email,
            tldr: parsedResult.tldr,
            summaryId: insertedSummary.id
        }).catch(error => {
            // Log error but don't fail the request
            console.error('Failed to send summary email:', error)
        })

        // Refresh dashboard/history
        revalidatePath('/dashboard')

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
