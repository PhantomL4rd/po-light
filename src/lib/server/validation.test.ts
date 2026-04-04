import { describe, expect, it } from 'vitest';
import { validateAdvisorResponse, validateInput } from './validation';

describe('validateInput', () => {
	it('かんたんモードの有効な入力を受け付ける', () => {
		const input = {
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal'
		};
		expect(validateInput(input)).toEqual(input);
	});

	it('詳細モードの有効な入力を受け付ける', () => {
		const input = {
			faceType: 'round_small',
			framing: 'full_body',
			groupSize: 'group',
			skinTone: 'tan',
			location: 'studio',
			timeOfDay: 'night',
			backlight: true,
			ambientColor: 'warm',
			shadowPref: 'strong',
			texturePref: 'glossy',
			mood: 'doll_like'
		};
		expect(validateInput(input)).toEqual(input);
	});

	it('必須フィールドが欠けている場合はエラー', () => {
		expect(() =>
			validateInput({
				faceType: 'standard',
				framing: 'half_body'
				// groupSize, skinTone missing
			})
		).toThrow();
	});

	it('無効な選択��値はエラー', () => {
		expect(() =>
			validateInput({
				faceType: 'invalid_value',
				framing: 'half_body',
				groupSize: 'solo',
				skinTone: 'normal'
			})
		).toThrow();
	});
});

describe('validateAdvisorResponse', () => {
	const validResponse = {
		lights: [
			{
				id: 1,
				role: '���インライト（キーライト）',
				type: 1,
				rgb: { r: 70, g: 70, b: 70 },
				direction: 'キャラの顔の左斜め前45度',
				vertical_angle: 'やや見下ろし45度',
				tip: 'ズーム200まで寄せてから設置'
			},
			{
				id: 2,
				role: 'フィルライト',
				type: 1,
				rgb: { r: 40, g: 40, b: 40 },
				direction: '反対側の顔の斜め前',
				vertical_angle: '同じ高さ',
				tip: '影を薄める程度に控えめに'
			},
			{
				id: 3,
				role: 'バックライト',
				type: 1,
				rgb: { r: 50, g: 50, b: 50 },
				direction: 'キャラの背面・頭上',
				vertical_angle: '上から',
				tip: '顔にこぼれすぎないよう注意'
			}
		],
		character_lighting: 100,
		brightness_manual: 167,
		notes: 'テスト'
	};

	it('有効なAIレスポンスを受け付ける', () => {
		expect(validateAdvisorResponse(validResponse)).toEqual(validResponse);
	});

	it('lightsが3つでない場合はエラー', () => {
		const bad = { ...validResponse, lights: [validResponse.lights[0]] };
		expect(() => validateAdvisorResponse(bad)).toThrow();
	});

	it('RGB値が0-255の範囲外の場合はエラー', () => {
		const bad = structuredClone(validResponse);
		bad.lights[0].rgb.r = 300;
		expect(() => validateAdvisorResponse(bad)).toThrow();
	});

	it('RGB値が負の場合はエラー', () => {
		const bad = structuredClone(validResponse);
		bad.lights[1].rgb.g = -1;
		expect(() => validateAdvisorResponse(bad)).toThrow();
	});

	it('character_lightingが0-100の範囲外の場合はエラー', () => {
		const bad = { ...validResponse, character_lighting: 101 };
		expect(() => validateAdvisorResponse(bad)).toThrow();
	});

	it('brightness_manualが0-200の範囲外の場合はエラー', () => {
		const bad = { ...validResponse, brightness_manual: 201 };
		expect(() => validateAdvisorResponse(bad)).toThrow();
	});

	it('必須フィールドが欠けている場合はエラー', () => {
		const { notes: _, ...bad } = validResponse;
		expect(() => validateAdvisorResponse(bad)).toThrow();
	});
});
