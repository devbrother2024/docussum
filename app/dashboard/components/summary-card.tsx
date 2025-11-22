'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Share2, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SummaryResult {
    tldr: string
    content: string
}

interface SummaryCardProps {
    result: SummaryResult
}

export function SummaryCard({ result }: SummaryCardProps) {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        const textToCopy = `# 3줄 요약\n${result.tldr}\n\n# 상세 요약\n${result.content}`
        try {
            await navigator.clipboard.writeText(textToCopy)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* TL;DR Section */}
            <Card className="border-none shadow-md bg-sidebar-accent/30">
                <CardHeader className="pb-2 flex flex-row items-center gap-2 space-y-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-primary">
                        3줄 요약 (TL;DR)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-p:leading-relaxed text-foreground/90">
                        <ReactMarkdown>{result.tldr}</ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Section */}
            <div className="relative bg-card rounded-xl border shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        상세 요약
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                            className="h-9 w-9 transition-all hover:bg-muted"
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">Copy summary</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 transition-all hover:bg-muted"
                            disabled // Feature not implemented yet
                        >
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Share summary</span>
                        </Button>
                    </div>
                </div>

                <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary hover:prose-a:underline text-foreground">
                    <ReactMarkdown>{result.content}</ReactMarkdown>
                </article>
            </div>
        </div>
    )
}
