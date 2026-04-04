// --- フォーム入力 ---

export type FaceType = 'round_small' | 'standard' | 'angular';
export type Framing = 'half_body' | 'full_body';
export type GroupSize = 'solo' | 'group';
export type SkinTone = 'normal' | 'tan' | 'blue' | 'dark_exotic' | 'light_exotic';

export type Location = 'studio' | 'outdoor';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
export type Weather = 'sunny' | 'cloudy' | 'rainy';
export type SunExposure = 'direct' | 'shade';
export type AmbientColor = 'warm' | 'cool' | 'neutral' | 'none';
export type ShadowPref = 'strong' | 'natural' | 'flat';
export type TexturePref = 'glossy' | 'matte' | 'natural';

export interface SimpleInput {
	faceType: FaceType;
	framing: Framing;
	groupSize: GroupSize;
	skinTone: SkinTone;
}

export interface DetailedInput extends SimpleInput {
	location?: Location;
	timeOfDay?: TimeOfDay;
	weather?: Weather;
	backlight?: boolean;
	sunExposure?: SunExposure;
	ambientColor?: AmbientColor;
	shadowPref?: ShadowPref;
	texturePref?: TexturePref;
}

// --- AIレスポンス ---

export interface RGB {
	r: number;
	g: number;
	b: number;
}

export interface LightConfig {
	id: number;
	role: string | null;
	type: number | null;
	rgb: RGB | null;
	direction: string | null;
	vertical_angle: string | null;
	tip: string | null;
}

export interface AdvisorResponse {
	lights: [LightConfig, LightConfig, LightConfig];
	character_lighting: number;
	brightness_manual: number;
	notes: string;
}

// --- DB ---

export interface LightingFeedback {
	id: number;
	inputJson: string;
	outputJson: string;
	rating: number | null;
	memo: string | null;
	createdAt: string;
}
