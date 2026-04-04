import { error, json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { saveFeedback } from '$lib/server/db/queries';
import type { RequestHandler } from './$types';

/** 「よかった」評価のみ匿名でD1に保存 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB;
	if (!db) error(500, 'Database not available');

	const body: Record<string, unknown> = await request.json();
	const { input, output, rating } = body;

	if (!input || !output || rating !== 1) {
		error(400, 'Invalid feedback');
	}

	const id = await saveFeedback(getDb(db), JSON.stringify(input), JSON.stringify(output), 1, null);

	return json({ id });
};
