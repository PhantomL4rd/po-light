<script lang="ts">
import { FACE_TYPES, FRAMINGS, GROUP_SIZES, SKIN_TONES } from '$lib/constants';
import type { DetailedInput } from '$lib/types';
import SelectField from './SelectField.svelte';

let { formData = $bindable() }: { formData: DetailedInput } = $props();
</script>

<div class="space-y-4">
	<SelectField label="顔の輪郭タイプ" options={FACE_TYPES} value={formData.faceType} onchange={(v) => (formData.faceType = v)} />
	<SelectField label="フレーミング" options={FRAMINGS} value={formData.framing} onchange={(v) => (formData.framing = v)} />
	<SelectField label="人数" options={GROUP_SIZES} value={formData.groupSize} onchange={(v) => (formData.groupSize = v)} />
	<SelectField label="肌色タイプ" options={SKIN_TONES} value={formData.skinTone} onchange={(v) => (formData.skinTone = v)} />
</div>
