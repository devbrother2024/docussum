'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserInfo() {
    const supabase = await createClient()
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const userList = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1)

    if (userList.length === 0) {
        return null
    }

    return {
        email: user.email || '',
        credits: userList[0].credits
    }
}
