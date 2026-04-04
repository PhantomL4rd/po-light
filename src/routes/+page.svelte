<script lang="ts">
import Loader2 from '@lucide/svelte/icons/loader-2';
import { onMount } from 'svelte';
import { saveToHistory } from '$lib/client/history';
import AdvisorForm from '$lib/components/advisor/AdvisorForm.svelte';
import AdvisorResult from '$lib/components/result/AdvisorResult.svelte';
import type { AdvisorResponse, DetailedInput } from '$lib/types';

let result = $state<AdvisorResponse | null>(null);
let currentInput = $state<DetailedInput | null>(null);
let isLoading = $state(false);
let errorMessage = $state<string | null>(null);
let initialInput = $state<DetailedInput | undefined>(undefined);

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

function handleSave() {
	if (!currentInput || !result) return;

	saveToHistory(currentInput, result);

	fetch('/api/feedback', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			input: currentInput,
			output: result,
			rating: 1
		})
	}).catch(() => {});
}

onMount(() => {
	const stored = sessionStorage.getItem('reuse_input');
	if (stored) {
		sessionStorage.removeItem('reuse_input');
		try {
			initialInput = JSON.parse(stored);
		} catch {
			// ignore
		}
	}
});
</script>

<div class="space-y-8">
	<AdvisorForm onsubmit={handleSubmit} loading={isLoading} {initialInput} />

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
		<AdvisorResult {result} input={currentInput} onsave={handleSave} />
	{/if}
</div>
