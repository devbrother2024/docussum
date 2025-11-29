'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { summaries } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getHistory() {
    const supabase = await createClient()
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const history = await db
        .select({
            id: summaries.id,
            type: summaries.type,
            tldr: summaries.tldr,
            createdAt: summaries.createdAt
        })
        .from(summaries)
        .where(eq(summaries.userId, user.id))
        .orderBy(desc(summaries.createdAt))
        .limit(50)

    return history
}
