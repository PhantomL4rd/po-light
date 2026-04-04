<script lang="ts">
import { Loader2 } from 'lucide-svelte';
import { onMount } from 'svelte';
import AdvisorForm from '$lib/components/advisor/AdvisorForm.svelte';
import AdvisorResult from '$lib/components/result/AdvisorResult.svelte';
import { saveToHistory } from '$lib/client/history';
import type { AdvisorResponse, DetailedInput } from '$lib/types';

let result = $state<AdvisorResponse | null>(null);
let currentInput = $state<DetailedInput | null>(null);
let isLoading = $state(false);
let errorMessage = $state<string | null>(null);
let formRef: AdvisorForm | undefined = $state();

async function handleSubmit(input: DetailedInput) {
	isLoading = true;
	errorMessage = null;
	result = null;

	try {
		const res = await fetch('/api/advisor', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input)
		});

		if (!res.ok) {
			const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
			throw new Error(
				(typeof data?.message === 'string' ? data.message : null) ??
					`エラーが発生しました (${res.status})`
			);
		}

		result = await res.json();
		currentInput = input;
	} catch (e) {
		errorMessage = e instanceof Error ? e.message : '不明なエラーが発生しました';
	} finally {
		isLoading = false;
	}
}

function handleRate(rating: number) {
	if (!currentInput || !result) return;

	// LocalStorageに保存（全評価）
	saveToHistory(currentInput, result, rating);

	// 「よかった」のみD1に匿名送信（fire-and-forget）
	if (rating === 1) {
		fetch('/api/feedback', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				input: currentInput,
				output: result,
				rating
			})
		}).catch(() => {
			// 匿名送信の失敗は無視
		});
	}
}

onMount(() => {
	const stored = sessionStorage.getItem('reuse_input');
	if (stored) {
		sessionStorage.removeItem('reuse_input');
		try {
			const input: DetailedInput = JSON.parse(stored);
			formRef?.restoreInput(input);
		} catch {
			// ignore
		}
	}
});
</script>

<div class="space-y-8">
	<AdvisorForm bind:this={formRef} onsubmit={handleSubmit} loading={isLoading} />

	{#if isLoading}
		<div class="flex items-center justify-center gap-2 py-8 text-muted-foreground">
			<Loader2 class="size-5 animate-spin" />
			<span>AIが考え中...</span>
		</div>
	{/if}

	{#if errorMessage}
		<div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
			{errorMessage}
		</div>
	{/if}

	{#if result && currentInput}
		<AdvisorResult {result} input={currentInput} onsave={handleRate} />
	{/if}
</div>
