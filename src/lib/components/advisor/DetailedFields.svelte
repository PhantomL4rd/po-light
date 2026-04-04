<script lang="ts">
import {
	AMBIENT_COLORS,
	FACE_TYPES,
	FRAMINGS,
	GROUP_SIZES,
	LOCATIONS,
	MOODS,
	SHADOW_PREFS,
	SKIN_TONES,
	TEXTURE_PREFS,
	TIME_OF_DAYS
} from '$lib/constants';
import type { DetailedInput } from '$lib/types';
import SelectField from './SelectField.svelte';
import ToggleField from './ToggleField.svelte';

let { formData = $bindable() }: { formData: DetailedInput } = $props();

let backlight = $state(formData.backlight ?? false);

$effect(() => {
	formData.backlight = backlight;
});
</script>

<div class="space-y-4">
	<SelectField label="顔の輪郭タイプ" options={FACE_TYPES} value={formData.faceType} onchange={(v) => (formData.faceType = v)} />
	<SelectField label="フレーミング" options={FRAMINGS} value={formData.framing} onchange={(v) => (formData.framing = v)} />
	<SelectField label="人数" options={GROUP_SIZES} value={formData.groupSize} onchange={(v) => (formData.groupSize = v)} />
	<SelectField label="肌色タイプ" options={SKIN_TONES} value={formData.skinTone} onchange={(v) => (formData.skinTone = v)} />

	<hr class="border-border" />

	<SelectField label="撮影場所" options={LOCATIONS} value={formData.location} onchange={(v) => (formData.location = v)} />
	<SelectField label="時間帯" options={TIME_OF_DAYS} value={formData.timeOfDay} onchange={(v) => (formData.timeOfDay = v)} />
	<ToggleField label="逆光" bind:checked={backlight} />
	<SelectField label="既存の環境光の色" options={AMBIENT_COLORS} value={formData.ambientColor} onchange={(v) => (formData.ambientColor = v)} />
	<SelectField label="影の好み" options={SHADOW_PREFS} value={formData.shadowPref} onchange={(v) => (formData.shadowPref = v)} />
	<SelectField label="質感の好み" options={TEXTURE_PREFS} value={formData.texturePref} onchange={(v) => (formData.texturePref = v)} />
	<SelectField label="雰囲気" options={MOODS} value={formData.mood} onchange={(v) => (formData.mood = v)} />
</div>
