import type {
	AmbientColor,
	FaceType,
	Framing,
	GroupSize,
	Location,
	ShadowPref,
	SkinTone,
	SunExposure,
	TexturePref,
	TimeOfDay,
	Weather
} from '$lib/types';

interface Option<T extends string> {
	value: T;
	label: string;
}

export const FACE_TYPES: readonly Option<FaceType>[] = [
	{ value: 'round_small', label: '丸め・小柄' },
	{ value: 'standard', label: '標準' },
	{ value: 'angular', label: '角・突起あり' }
] as const;

export const FRAMINGS: readonly Option<Framing>[] = [
	{ value: 'half_body', label: '半身' },
	{ value: 'full_body', label: '全身' }
] as const;

export const GROUP_SIZES: readonly Option<GroupSize>[] = [
	{ value: 'solo', label: 'ソロ' },
	{ value: 'group', label: '複数人' }
] as const;

export const SKIN_TONES: readonly Option<SkinTone>[] = [
	{ value: 'normal', label: '通常' },
	{ value: 'tan', label: '褐色' },
	{ value: 'blue', label: '青肌' },
	{ value: 'dark_exotic', label: '異色（黒・暗め）' },
	{ value: 'light_exotic', label: '異色（白・明るめ）' }
] as const;

export const LOCATIONS: readonly Option<Location>[] = [
	{ value: 'studio', label: 'スタジオ（ハウジング等）' },
	{ value: 'outdoor', label: '屋外' }
] as const;

export const TIME_OF_DAYS: readonly Option<TimeOfDay>[] = [
	{ value: 'morning', label: '朝' },
	{ value: 'day', label: '昼' },
	{ value: 'evening', label: '夕方' },
	{ value: 'night', label: '夜' }
] as const;

export const WEATHERS: readonly Option<Weather>[] = [
	{ value: 'sunny', label: '晴れ' },
	{ value: 'cloudy', label: '曇り' },
	{ value: 'rainy', label: '雨' }
] as const;

export const SUN_EXPOSURES: readonly Option<SunExposure>[] = [
	{ value: 'direct', label: '日なた' },
	{ value: 'shade', label: '日陰' }
] as const;

export const AMBIENT_COLORS: readonly Option<AmbientColor>[] = [
	{ value: 'warm', label: '暖色系' },
	{ value: 'cool', label: '寒色系' },
	{ value: 'neutral', label: 'ニュートラル' },
	{ value: 'none', label: 'ほぼなし' }
] as const;

export const SHADOW_PREFS: readonly Option<ShadowPref>[] = [
	{ value: 'strong', label: '陰影強め' },
	{ value: 'natural', label: '自然' },
	{ value: 'flat', label: 'フラット' }
] as const;

export const TEXTURE_PREFS: readonly Option<TexturePref>[] = [
	{ value: 'glossy', label: 'ツヤ感・透明感' },
	{ value: 'matte', label: 'マット' },
	{ value: 'natural', label: 'ナチュラル' }
] as const;

/** value → label の変換ヘルパー */
export function findLabel<T extends string>(options: readonly Option<T>[], value: T): string {
	return options.find((o) => o.value === value)?.label ?? value;
}
