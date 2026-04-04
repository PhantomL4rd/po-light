<script lang="ts">
import { ThumbsDown, ThumbsUp } from 'lucide-svelte';
import { Button } from '$lib/components/ui/button';

let {
	onsave,
	saving = false
}: {
	onsave: (rating: number) => void;
	saving?: boolean;
} = $props();

let saved = $state(false);

function handleRate(rating: number) {
	onsave(rating);
	saved = true;
}
</script>

{#if saved}
	<div class="rounded-md border border-green-500/50 bg-green-500/10 px-4 py-3 text-center text-sm text-green-700 dark:text-green-400">
		保存しました
	</div>
{:else}
	<div class="flex items-center justify-center gap-3">
		<Button variant="outline" size="sm" disabled={saving} onclick={() => handleRate(1)}>
			<ThumbsUp class="size-4" />
			よかった
		</Button>
		<Button variant="outline" size="sm" disabled={saving} onclick={() => handleRate(0)}>
			<ThumbsDown class="size-4" />
			いまいち
		</Button>
	</div>
{/if}
