<script lang="ts">
import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
import { Button } from '$lib/components/ui/button';

let {
	onsave,
	saving = false
}: {
	onsave: () => void;
	saving?: boolean;
} = $props();

let saved = $state(false);

function handleSave() {
	onsave();
	saved = true;
}
</script>

{#if saved}
	<div class="rounded-md border border-liked/30 bg-liked/10 px-4 py-3 text-center text-sm text-liked">
		保存しました
	</div>
{:else}
	<div class="flex items-center justify-center">
		<Button variant="outline" size="sm" disabled={saving} onclick={handleSave}>
			<ThumbsUp class="size-4" />
			よかった
		</Button>
	</div>
{/if}
