<script lang="ts">
import {
	AMBIENT_COLORS,
	FACE_TYPES,
	FRAMINGS,
	GROUP_SIZES,
	LOCATIONS,
	SHADOW_PREFS,
	SKIN_TONES,
	SUN_EXPOSURES,
	TEXTURE_PREFS,
	TIME_OF_DAYS,
	WEATHERS
} from '$lib/constants';
import type { DetailedInput } from '$lib/types';
import SelectField from './SelectField.svelte';
import ToggleField from './ToggleField.svelte';

let { formData = $bindable() }: { formData: DetailedInput } = $props();

let backlight = $state(formData.backlight ?? false);
let isOutdoor = $derived(formData.location === 'outdoor');

$effect(() => {
	formData.backlight = backlight;
});

$effect(() => {
	if (!isOutdoor) {
		formData.timeOfDay = undefined;
		formData.weather = undefined;
		formData.sunExposure = undefined;
	}
});
</script>

<div class="space-y-4">
	<SelectField label="顔の輪郭タイプ" options={FACE_TYPES} value={formData.faceType} onchange={(v) => (formData.faceType = v)} />
	<SelectField label="フレーミング" options={FRAMINGS} value={formData.framing} onchange={(v) => (formData.framing = v)} />
	<SelectField label="人数" options={GROUP_SIZES} value={formData.groupSize} onchange={(v) => (formData.groupSize = v)} />
	<SelectField label="肌色タイプ" options={SKIN_TONES} value={formData.skinTone} onchange={(v) => (formData.skinTone = v)} />

	<hr class="border-border" />

	<SelectField label="撮影場所" options={LOCATIONS} value={formData.location} onchange={(v) => (formData.location = v)} />
	{#if isOutdoor}
		<SelectField label="時間帯" options={TIME_OF_DAYS} value={formData.timeOfDay} onchange={(v) => (formData.timeOfDay = v)} />
		<SelectField label="天候" options={WEATHERS} value={formData.weather} onchange={(v) => (formData.weather = v)} />
		<SelectField label="日照" options={SUN_EXPOSURES} value={formData.sunExposure} onchange={(v) => (formData.sunExposure = v)} />
	{/if}
	<ToggleField label="逆光" bind:checked={backlight} />
	<SelectField label="既存の環境光の色" options={AMBIENT_COLORS} value={formData.ambientColor} onchange={(v) => (formData.ambientColor = v)} />
	<SelectField label="影の好み" options={SHADOW_PREFS} value={formData.shadowPref} onchange={(v) => (formData.shadowPref = v)} />
	<SelectField label="質感の好み" options={TEXTURE_PREFS} value={formData.texturePref} onchange={(v) => (formData.texturePref = v)} />
</div>
