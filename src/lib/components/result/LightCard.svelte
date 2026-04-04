<script lang="ts">
import * as Card from '$lib/components/ui/card';
import type { LightConfig } from '$lib/types';

let { light }: { light: LightConfig } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-base">
			ライト{light.id} - {light.role}
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-2 text-sm">
		{#if light.type !== null}
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">タイプ</span>
				<span class="font-mono">{light.type}</span>
			</div>
		{/if}
		{#if light.rgb}
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">RGB</span>
				<span class="font-mono">
					R:{light.rgb.r} G:{light.rgb.g} B:{light.rgb.b}
				</span>
			</div>
		{/if}
		{#if light.direction}
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">方向</span>
				<span>{light.direction}</span>
			</div>
		{/if}
		{#if light.vertical_angle}
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground">垂直角度</span>
				<span>{light.vertical_angle}</span>
			</div>
		{/if}
		{#if light.tip}
			<p class="mt-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
				{light.tip}
			</p>
		{/if}
	</Card.Content>
</Card.Root>
