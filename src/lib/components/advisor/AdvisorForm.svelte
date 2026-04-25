<script lang="ts">
import Sparkles from '@lucide/svelte/icons/sparkles';
import { Button } from '$lib/components/ui/button';
import type { DetailedInput } from '$lib/types';
import DetailedFields from './DetailedFields.svelte';

let {
	onsubmit,
	loading = false,
	initialInput = undefined
}: {
	onsubmit: (input: DetailedInput) => void;
	loading?: boolean;
	initialInput?: DetailedInput;
} = $props();

let formData = $state<DetailedInput>({
	framing: 'half_body',
	groupSize: 'solo',
	skinTone: 'normal'
});

$effect(() => {
	if (initialInput) {
		formData = { ...initialInput };
	}
});

function handleSubmit() {
	onsubmit({ ...formData });
}
</script>

<div class="space-y-6">
	<DetailedFields bind:formData />

	<Button class="w-full" onclick={handleSubmit} disabled={loading}>
		<Sparkles class="size-4" />
		{loading ? '提案中...' : '提案してもらう'}
	</Button>
</div>
