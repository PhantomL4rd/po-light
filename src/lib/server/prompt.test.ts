import { describe, expect, it } from 'vitest';
import type { DetailedInput } from '$lib/types';
import { buildUserPrompt, SYSTEM_PROMPT } from './prompt';

describe('SYSTEM_PROMPT', () => {
	it('GPoseライティング専門家としての指示を含む', () => {
		expect(SYSTEM_PROMPT).toContain('GPose');
		expect(SYSTEM_PROMPT).toContain('JSON');
	});
});

describe('buildUserPrompt', () => {
	it('かんたんモードの入力では詳細フィールドを含まない', () => {
		const input: DetailedInput = {
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal'
		};
		const prompt = buildUserPrompt(input);

		expect(prompt).toContain('顔の輪郭タイプ:');
		expect(prompt).toContain('フレーミング:');
		expect(prompt).toContain('人数:');
		expect(prompt).toContain('肌色タイプ:');
		expect(prompt).not.toContain('撮影場所:');
		expect(prompt).not.toContain('時間帯:');
		expect(prompt).not.toContain('雰囲気:');
	});

	it('詳細モードの入力で全フィールドキーを含む', () => {
		const input: DetailedInput = {
			faceType: 'round_small',
			framing: 'full_body',
			groupSize: 'group',
			skinTone: 'tan',
			location: 'outdoor',
			timeOfDay: 'evening',
			weather: 'sunny',
			backlight: true,
			sunExposure: 'direct',
			ambientColor: 'cool',
			shadowPref: 'strong',
			texturePref: 'glossy'
		};
		const prompt = buildUserPrompt(input);

		expect(prompt).toContain('撮影場所:');
		expect(prompt).toContain('時間帯:');
		expect(prompt).toContain('天候:');
		expect(prompt).toContain('逆光:');
		expect(prompt).toContain('日照:');
		expect(prompt).toContain('環境光の色:');
		expect(prompt).toContain('影の好み:');
		expect(prompt).toContain('質感の好み:');
	});

	it('backlight=false のときは「なし」と表示', () => {
		const input: DetailedInput = {
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal',
			backlight: false
		};
		const prompt = buildUserPrompt(input);
		expect(prompt).toContain('逆光: なし');
	});
});
