import { describe, expect, it } from 'vitest';
import type { DetailedInput } from '$lib/types';
import { buildSystemPrompt, buildUserPrompt } from './prompt';

describe('buildSystemPrompt', () => {
	it('共通の基本指示を常に含む', () => {
		const prompt = buildSystemPrompt({
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal'
		});
		expect(prompt).toContain('GPose');
		expect(prompt).toContain('JSON');
	});

	it('屋外のとき屋外セクションを含み、屋内セクションを含まない', () => {
		const prompt = buildSystemPrompt({
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal',
			location: 'outdoor',
			timeOfDay: 'day',
			weather: 'sunny',
			sunExposure: 'direct'
		});
		expect(prompt).toContain('屋外撮影への対応');
		expect(prompt).not.toContain('スタジオ撮影への対応');
	});

	it('スタジオのとき屋内セクションを含み、屋外セクションを含まない', () => {
		const prompt = buildSystemPrompt({
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal',
			location: 'studio'
		});
		expect(prompt).toContain('スタジオ撮影への対応');
		expect(prompt).not.toContain('屋外撮影への対応');
	});

	it('locationがundefined（かんたんモード）のとき屋内前提になる', () => {
		const prompt = buildSystemPrompt({
			faceType: 'standard',
			framing: 'half_body',
			groupSize: 'solo',
			skinTone: 'normal'
		});
		expect(prompt).toContain('スタジオ撮影への対応');
		expect(prompt).not.toContain('屋外撮影への対応');
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
