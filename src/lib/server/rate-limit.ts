const PO_LIGHT_DAILY_LIMIT = 10;

interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	limit: number;
}

export async function checkRateLimit(
	rateLimiter: DurableObjectNamespace,
	clientIp: string
): Promise<RateLimitResult> {
	try {
		const id = rateLimiter.idFromName(`po-light:${clientIp}`);
		const stub = rateLimiter.get(id);

		const response = await stub.fetch('https://rate-limiter/consume', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ limit: PO_LIGHT_DAILY_LIMIT })
		});

		return (await response.json()) as RateLimitResult;
	} catch {
		// ローカル開発時など、DOが利用不可の場合は許可
		return { allowed: true, remaining: PO_LIGHT_DAILY_LIMIT, limit: PO_LIGHT_DAILY_LIMIT };
	}
}
