import { error, json } from '@sveltejs/kit';
import { callGemini } from '$lib/server/gemini';
import { buildUserPrompt, SYSTEM_PROMPT } from '$lib/server/prompt';
import { checkRateLimit } from '$lib/server/rate-limit';
import { validateAdvisorResponse, validateInput } from '$lib/server/validation';
import type { AdvisorResponse, DetailedInput } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
	if (!platform?.env) {
		error(500, 'Platform not available');
	}

	const { GEMINI_API_KEY, IP_RATE_LIMITER } = platform.env;

	if (!GEMINI_API_KEY) {
		error(500, 'API key not configured');
	}

	// レートリミットチェック（DOが利用可能な場合のみ）
	if (IP_RATE_LIMITER) {
		const clientIp = getClientAddress();
		const rateResult = await checkRateLimit(IP_RATE_LIMITER, clientIp);
		if (!rateResult.allowed) {
			error(429, `本日の利用上限（${rateResult.limit}回）に達しました。明日またお試しください。`);
		}
	}

	// 入力バリデーション
	const body = await request.json();
	const input: DetailedInput = parseInput(body);

	// プロンプト生成 → Gemini呼び出し
	const userPrompt = buildUserPrompt(input);
	const rawResponse: unknown = await callGeminiSafe(GEMINI_API_KEY, userPrompt);

	// AIレスポンスバリデーション
	const validated: AdvisorResponse = parseResponse(rawResponse);

	return json(validated);
};

function parseInput(body: unknown): DetailedInput {
	try {
		return validateInput(body);
	} catch {
		error(400, '入力が不正です');
	}
}

async function callGeminiSafe(apiKey: string, userPrompt: string): Promise<unknown> {
	try {
		return await callGemini(apiKey, SYSTEM_PROMPT, userPrompt);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'AI呼び出しに失敗しました';
		error(502, message);
	}
}

function parseResponse(rawResponse: unknown): AdvisorResponse {
	try {
		return validateAdvisorResponse(rawResponse);
	} catch (e) {
		console.error('AI response validation failed:', e);
		console.error('Raw response:', JSON.stringify(rawResponse, null, 2));
		error(502, 'AIからの応答が不正なフォーマットでした');
	}
}
