import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { lightingFeedbacks } from './schema';
import type * as schema from './schema';

type DB = DrizzleD1Database<typeof schema>;

/** 「よかった」評価を匿名でD1に保存 */
export async function saveFeedback(
	db: DB,
	inputJson: string,
	outputJson: string,
	rating: number,
	memo: string | null
) {
	const result = await db
		.insert(lightingFeedbacks)
		.values({ inputJson, outputJson, rating, memo })
		.returning({ id: lightingFeedbacks.id });

	return result[0].id;
}
