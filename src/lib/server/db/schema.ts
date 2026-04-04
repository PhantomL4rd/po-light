import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const lightingFeedbacks = sqliteTable('lighting_feedbacks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	inputJson: text('input_json').notNull(),
	outputJson: text('output_json').notNull(),
	rating: integer('rating'),
	memo: text('memo'),
	createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
});
