<script lang="ts">
import * as Card from '$lib/components/ui/card';
import type { AdvisorResponse, DetailedInput } from '$lib/types';
import FeedbackActions from './FeedbackActions.svelte';
import LightCard from './LightCard.svelte';

let {
	result,
	input,
	onsave
}: {
	result: AdvisorResponse;
	input: DetailedInput;
	onsave: () => void;
} = $props();
</script>

<div class="space-y-4">
	{#each result.lights as light (light.id)}
		<LightCard {light} />
	{/each}

	<Card.Root>
		<Card.Content class="space-y-2 pt-6 text-sm">
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">キャラクターライティング</span>
				<span class="font-mono font-semibold">{result.character_lighting}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">明るさのマニュアル調整</span>
				<span class="font-mono font-semibold">{result.brightness_manual}</span>
			</div>
		</Card.Content>
	</Card.Root>

	<FeedbackActions {onsave} />
</div>
