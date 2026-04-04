<script lang="ts">
import { Inbox } from 'lucide-svelte';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import FeedbackCard from '$lib/components/history/FeedbackCard.svelte';
import { getHistory, type HistoryEntry } from '$lib/client/history';

let entries = $state<HistoryEntry[]>([]);

onMount(() => {
	entries = getHistory();
});

function handleReuse(entry: HistoryEntry) {
	sessionStorage.setItem('reuse_input', JSON.stringify(entry.input));
	goto('/');
}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold">履歴</h1>
		<p class="mt-1 text-sm text-muted-foreground">保存済みのライティング設定一覧</p>
	</div>

	{#if entries.length === 0}
		<div class="flex flex-col items-center gap-2 py-12 text-muted-foreground">
			<Inbox class="size-8" />
			<p class="text-sm">まだ保存された設定はありません</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each entries as entry (entry.id)}
				<FeedbackCard {entry} onreuse={() => handleReuse(entry)} />
			{/each}
		</div>
	{/if}
</div>
