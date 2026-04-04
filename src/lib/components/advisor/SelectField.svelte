<script lang="ts" generics="T extends string">
import { Label } from '$lib/components/ui/label';
import * as RadioGroup from '$lib/components/ui/radio-group';

interface Option {
	value: T;
	label: string;
}

let {
	label,
	options,
	value,
	onchange
}: {
	label: string;
	options: readonly Option[];
	value: T | undefined;
	onchange: (value: T) => void;
} = $props();

let current = $derived(value ?? ('' as T));
</script>

<fieldset class="space-y-2">
	<Label class="text-sm font-medium">{label}</Label>
	<RadioGroup.Root value={current} onValueChange={(v) => onchange(v as T)} class="flex flex-wrap gap-2">
		{#each options as option (option.value)}
			<label
				class="cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors
					{current === option.value
					? 'border-primary bg-primary/10 text-primary'
					: 'border-border text-muted-foreground hover:border-foreground/30'}"
			>
				<RadioGroup.Item value={option.value} class="sr-only" />
				{option.label}
			</label>
		{/each}
	</RadioGroup.Root>
</fieldset>
