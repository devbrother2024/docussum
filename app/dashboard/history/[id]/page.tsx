import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SummaryCard } from '../../components/summary-card'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { summaries } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

function getTitleFromTldr(tldr: string | null): string {
    if (!tldr) return '제목 없음'
    const firstLine = tldr.split('\n')[0].trim()
    const cleaned = firstLine
        .replace(/^[-*•]\s*/, '')
        .replace(/\*\*/g, '')
        .trim()
    return cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned
}

export default async function HistoryDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Get authenticated user
    const supabase = await createClient()
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch summary by ID
    const summaryList = await db
        .select()
        .from(summaries)
        .where(eq(summaries.id, id))
        .limit(1)

    if (summaryList.length === 0) {
        redirect('/dashboard')
    }

    const summary = summaryList[0]

    // Check if user owns this summary
    if (summary.userId !== user.id) {
        redirect('/dashboard')
    }

    const title = getTitleFromTldr(summary.tldr)
    const formattedDate = formatDistanceToNow(summary.createdAt, {
        addSuffix: true,
        locale: ko
    })

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-10 px-4 md:px-6 space-y-6">
            <div className="w-full flex items-center justify-start">
                <Button
                    variant="ghost"
                    asChild
                    className="pl-0 hover:bg-transparent hover:text-primary"
                >
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="uppercase tracking-wider font-semibold text-xs bg-secondary px-2 py-1 rounded">
                        {summary.type}
                    </span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </div>

            <div className="w-full">
                <SummaryCard
                    result={{
                        tldr: summary.tldr || '',
                        content: summary.content || ''
                    }}
                />
            </div>
        </div>
    )
}
