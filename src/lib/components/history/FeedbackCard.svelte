<script lang="ts">
import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
import type { HistoryEntry } from '$lib/client/history';
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import { FACE_TYPES, FRAMINGS, findLabel, GROUP_SIZES, SKIN_TONES } from '$lib/constants';

let { entry, onreuse }: { entry: HistoryEntry; onreuse: () => void } = $props();
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title class="text-sm">
				{findLabel(FACE_TYPES, entry.input.faceType)} / {findLabel(FRAMINGS, entry.input.framing)} / {findLabel(GROUP_SIZES, entry.input.groupSize)} / {findLabel(SKIN_TONES, entry.input.skinTone)}
			</Card.Title>
		</div>
		<p class="text-xs text-muted-foreground">
			{new Date(entry.createdAt).toLocaleString('ja-JP')}
		</p>
	</Card.Header>
	<Card.Content class="space-y-3 text-sm">
		{#each entry.output.lights as light (light.id)}
			<div class="rounded-md border border-border px-3 py-2">
				<div class="flex items-center justify-between">
					<span class="font-medium">ライト{light.id}</span>
					<span class="text-xs text-muted-foreground">{light.role}</span>
				</div>
				<div class="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
					<span>タイプ {light.type}</span>
					<span>R:{light.rgb.r} G:{light.rgb.g} B:{light.rgb.b}</span>
					<span>{light.direction}</span>
				</div>
			</div>
		{/each}
		<div class="flex gap-4 text-xs text-muted-foreground">
			<span>キャラクターライティング: <strong class="text-foreground">{entry.output.character_lighting}</strong></span>
			<span>明るさ: <strong class="text-foreground">{entry.output.brightness_manual}</strong></span>
		</div>
	</Card.Content>
	<Card.Footer>
		<Button variant="outline" size="sm" onclick={onreuse}>
			<RotateCcw class="size-3.5" />
			再利用
		</Button>
	</Card.Footer>
</Card.Root>
