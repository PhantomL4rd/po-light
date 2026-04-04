<script lang="ts">
import { Label } from '$lib/components/ui/label';
import { Switch } from '$lib/components/ui/switch';

let {
	label,
	checked = $bindable(false)
}: {
	label: string;
	checked: boolean;
} = $props();
</script>

<div class="flex items-center justify-between rounded-md border border-border px-3 py-2">
	<Label class="text-sm font-medium">{label}</Label>
	<Switch bind:checked />
</div>
