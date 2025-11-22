import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').primaryKey(), // References Supabase Auth ID
    email: text('email').notNull(),
    credits: integer('credits').default(3).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const summaries = pgTable('summaries', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(), // Foreign key to users (conceptually)
    type: text('type').notNull(), // 'text' or 'youtube'
    originalContent: text('original_content'),
    tldr: text('tldr'),
    content: text('content'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})
