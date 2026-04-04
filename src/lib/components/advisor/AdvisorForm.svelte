<script lang="ts">
import Sparkles from '@lucide/svelte/icons/sparkles';
import { Button } from '$lib/components/ui/button';
import * as Tabs from '$lib/components/ui/tabs';
import type { DetailedInput } from '$lib/types';
import DetailedFields from './DetailedFields.svelte';
import SimpleFields from './SimpleFields.svelte';

let {
	onsubmit,
	loading = false,
	initialInput = undefined
}: {
	onsubmit: (input: DetailedInput) => void;
	loading?: boolean;
	initialInput?: DetailedInput;
} = $props();

let mode = $state<'simple' | 'detailed'>('simple');

let formData = $state<DetailedInput>({
	faceType: 'standard',
	framing: 'half_body',
	groupSize: 'solo',
	skinTone: 'normal'
});

// initialInput が渡されたらフォームを復元
$effect(() => {
	if (initialInput) {
		formData = { ...initialInput };
		if (initialInput.location || initialInput.timeOfDay || initialInput.mood) {
			mode = 'detailed';
		}
	}
});

function handleSubmit() {
	if (mode === 'simple') {
		onsubmit({
			faceType: formData.faceType,
			framing: formData.framing,
			groupSize: formData.groupSize,
			skinTone: formData.skinTone
		});
	} else {
		onsubmit({ ...formData });
	}
}
</script>

<div class="space-y-6">
	<Tabs.Root bind:value={mode}>
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="simple">かんたん</Tabs.Trigger>
			<Tabs.Trigger value="detailed">詳細</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="simple" class="mt-4">
			<SimpleFields bind:formData />
		</Tabs.Content>
		<Tabs.Content value="detailed" class="mt-4">
			<DetailedFields bind:formData />
		</Tabs.Content>
	</Tabs.Root>

	<Button class="w-full" onclick={handleSubmit} disabled={loading}>
		<Sparkles class="size-4" />
		{loading ? '提案中...' : '提案してもらう'}
	</Button>
</div>
