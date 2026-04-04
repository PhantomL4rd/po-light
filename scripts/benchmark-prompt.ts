/**
 * プロンプト品質ベンチマーク
 *
 * 旧プロンプト（具体値テンプレート）と新プロンプト（原則ベース）を比較し、
 * Sensitivity / Consistency / Constraint adherence を評価する。
 *
 * 使い方:
 *   npx tsx scripts/benchmark-prompt.ts
 *
 * 環境変数:
 *   GEMINI_API_KEY — Gemini API キー (.env から dotenv で読み込み)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// .env を手動パース（dotenv 不要）
try {
	const envPath = resolve(import.meta.dirname ?? '.', '..', '.env');
	const envContent = readFileSync(envPath, 'utf-8');
	for (const line of envContent.split('\n')) {
		const match = line.match(/^([^#=]+)=(.*)$/);
		if (match) process.env[match[1].trim()] = match[2].trim();
	}
} catch {
	// .env がなければ環境変数から読む
}

// ─── Constants ───

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
	console.error('GEMINI_API_KEY が設定されていません');
	process.exit(1);
}

// ─── Types ───

interface RGB {
	r: number;
	g: number;
	b: number;
}

interface LightConfig {
	id: number;
	role: string;
	type: number;
	rgb: RGB;
	direction: string;
	vertical_angle: string;
	tip: string;
}

interface AdvisorResponse {
	lights: [LightConfig, LightConfig, LightConfig];
	character_lighting: number;
	brightness_manual: number;
	notes: string;
}

interface TestCase {
	id: number;
	label: string;
	kind: 'base' | 'boundary' | 'contrast';
	contrastPair?: number;
	input: Record<string, unknown>;
}

interface RunResult {
	testId: number;
	prompt: 'old' | 'new';
	response: AdvisorResponse | null;
	error?: string;
}

// ─── Prompts ───

const OLD_PROMPT = `あなたはFF14のグループポーズ（GPose）ライティング専門家です。
ユーザーの撮影条件を受け取り、GPoseのライト1〜3の設定値を提案してください。

以下のルールを厳守してください：
- 返答はJSONのみ。前置き・説明・マークダウン記法は一切含めないこと
- JSONのスキーマは必ず下記の通りにすること

知識として以下を参照してください：
- タイプ1/2/3は光の強さではなく照射範囲（1が最も狭い）
- ソロ撮影・半身はタイプ1、全身撮影はタイプ2を推奨
- 複数人撮影はタイプ2以上を推奨
- RGBは0〜255の整数
- 半身撮影の基本値：ライト1=RGB70、ライト2=RGB40、ライト3=RGB50
- 全身撮影の基本値：ライト1=RGB90、ライト2=RGB30、ライト3=環境に合わせて色付き
- 顔の輪郭タイプ「丸め・小柄」：ライト1を真横から耳狙い(RGB60)、ライト2を斜めからメイン(RGB50)、ライト3を耳裏からほっぺ(RGB40)。全体的に立体感を出すライティングが有効
- 顔の輪郭タイプ「角・突起あり」：コントラスト強め、ライト1の当て角がシビアなため微調整が必要
- 顔の輪郭タイプ「標準」：基本値をそのまま適用でOK
- 褐色キャラ：ライト1を強め調整
- 青肌キャラ：ライト1をRGB50スタートで明るすぎないよう調整
- 異色（黒）：ライト1=RGB70、ライト2=RGB30、ライト3=RGB30
- キャラクターライティングは初心者向けに100推奨、陰影を出したい場合は0〜50
- ライト設置時はズーム200最大＋マウス/パッドで最大まで寄せること

【ライティング比率の理論】
- 標準的な照度比率：キーライト=1（基準）、フィルライト=1/3〜1/2、バックライト=1/2〜1以上
- RGB値に換算するとキー=70の場合、フィル=23〜35、バック=35〜70が標準
- 陰影強め（ドラマチック）：キーとフィルの差を大きく（例：ライト1=90、ライト2=20〜25）
- 自然な陰影：キーとフィルの差を中程度（例：ライト1=70、ライト2=30〜35）
- フラット：キーとフィルの差を小さく（例：ライト1=60、ライト2=40〜50）
- フィルライトが強すぎると立体感が失われる。「のっぺりしたくない」場合はフィルを1/3以下に抑える
- フィルライトの配置：キーより正面に近い角度から当てる（キーが左45度ならフィルは右30度）
- フィルライトで新たな影を作らないこと
- バックライトの高さ：被写体後方の高さ50〜60度から当てるのが基本
- バックライトが強いほど劇的・演出的、弱いほど自然な雰囲気になる

【色温度の理論】
- R強め（例：r=100,g=60,b=40）：暖色・血色感・屋内暖色照明・夕暮れ演出
- B強め（例：r=40,g=60,b=100）：寒色・月光・クール・夜間屋外演出
- RGB均等（例：r=70,g=70,b=70）：ニュートラルな白色光・スタジオ撮影向き
- 環境光に色がある場合：バックライト（ライト3）をその色に合わせると馴染みやすい
- 肌に血色感を出したいとき：ライト1のRを若干強めに（例：r=80,g=65,b=60）
- 質感ツヤ感・透明感：ライト強度をやや高め＋バックライトで輪郭を強調
- 質感マット：ライト強度を抑えめ＋フィルライトで影を均一に
- 質感ナチュラル：基本値をそのまま適用

【環境別の対応方針】
- 逆光あり：キャラクターライティングを上げ（50〜100）、フィルライトでキャラ正面を補う
- 夜・暗い環境：明るさのマニュアル調整を高めに設定（150〜200）、ライト強度も全体的に上げる
- 屋外昼間（自然光強い）：ライト強度を高めにしないと環境光に埋もれる
- スタジオ（光源なし）：タイプ1固定でキャラだけを照らし、背景は暗いまま維持`;

const NEW_PROMPT = `あなたはFF14のグループポーズ（GPose）ライティング専門家です。
撮影条件に最も合う3灯ライティングを、毎回ゼロから考えて提案してください。

【判断原則】
- ライト1（キーライト）: 被写体を照らす主光源。最も明るくする
- ライト2（フィルライト）: キーが作った影を和らげる補助光。キーより弱く、新たな影を作らないこと
- ライト3（バックライト）: 輪郭分離や雰囲気づくりに使う。演出意図に応じて強弱を調整する
- GPoseのRGB値は現実の照明と異なり、少ない値で十分に明るい。基準値はキー=70、フィル=40、バック=50程度。ここから条件に応じて上下させること
- RGB値の実用範囲は概ね20〜120。これを超える値は不自然な結果になりやすい
- 影の好みが強いほど、キーとフィルの輝度差を広げる。柔らかくしたいほど差を狭める
- フィルが強すぎると立体感が失われ、のっぺりした印象になる
- 色温度は撮影の雰囲気に合わせる: 暖色寄りは血色感と柔らかさ、寒色寄りは静けさと透明感を出しやすい
- 環境光に色がある場合、少なくとも1灯をその色味に寄せると馴染みやすい
【肌色タイプへの対応】
- 標準的な肌色: 基本的な3灯配置で自然に仕上がる
- 褐色の肌: キーライトを強めに当て、肌の色味がしっかり出るようにする
- 青肌: キーライトを控えめにし、明るすぎて肌色が飛ばないよう注意する
- 異色（黒・暗め）の肌: キーライトはやや強め、フィルとバックは抑えめにして肌の質感を引き出す
- 異色（白・明るめ）の肌: キーライトを控えめにし、白飛びを防ぐ。フィルやバックで色味を補って表情を出す

【フレーミングと人数】
- 半身・ソロ撮影: 照射範囲が狭いタイプ（タイプ1）が適する
- 全身撮影: より広いタイプ（タイプ2）が適する
- 複数人撮影: タイプ2以上で全員をカバーする

【顔の輪郭への対応】
- 丸め・小柄な輪郭: 立体感を強調するライティングが有効。横方向や耳周りからの光で陰影をつける
- 角・突起がある輪郭: コントラスト強めが映えるが、光の角度が繊細なため方向を慎重に決める
- 標準的な輪郭: 基本的な3灯配置で自然に仕上がる

【環境への対応】
- 逆光がある場合: キャラクターライティングを上げ、フィルライトで正面を補う
- 夜・暗い環境: 明るさのマニュアル調整を高めに、ライト全体の強度も上げる
- 屋外昼間: 環境光に埋もれないよう、ライト強度を十分に確保する
- スタジオ（光源なし）: 狭い照射範囲でキャラだけを照らし、背景の暗さを活かす

【固定仕様】
- ライトタイプ1/2/3は光の強さではなく照射範囲を表す（1が最も狭い）
- RGBは各0〜255の整数
- キャラクターライティングは0〜100の整数
- 明るさのマニュアル調整は0〜200の整数
- 返答はJSONのみ。前置き・説明・マークダウン記法は一切含めないこと

【重要】
- RGB値は入力条件から毎回導出すること。定型的なテンプレート値を使い回さないこと
- 同じ条件でも、環境や雰囲気の組み合わせによって異なる提案ができることを意識すること
- notesには、なぜその配色と比率にしたかの意図を短く書くこと`;

// ─── Test Cases ───

const LABEL_MAP: Record<string, Record<string, string>> = {
	faceType: { round_small: '丸め・小柄', standard: '標準', angular: '角・突起あり' },
	framing: { half_body: '半身', full_body: '全身' },
	groupSize: { solo: 'ソロ', group: '複数人' },
	skinTone: {
		normal: '通常',
		tan: '褐色',
		blue: '青肌',
		dark_exotic: '異色（黒・暗め）',
		light_exotic: '異色（白・明るめ）',
	},
	location: { studio: 'スタジオ（ハウジング等）', outdoor: '屋外' },
	timeOfDay: { day: '昼', night: '夜' },
	ambientColor: { warm: '暖色系', cool: '寒色系', neutral: 'ニュートラル', none: 'ほぼなし' },
	shadowPref: { strong: '陰影強め', natural: '自然', flat: 'フラットでいい' },
	texturePref: { glossy: 'ツヤ感・透明感', matte: 'マット', natural: 'ナチュラル' },
	mood: { bright: '自然に明るく', doll_like: 'ドール感・立体的', emotional: 'エモい・暗め', cool: 'かっこよく' },
};

const TEST_CASES: TestCase[] = [
	// ベースケース: 典型的な入力
	{
		id: 1, label: 'ベース: 標準/半身/ソロ/通常（かんたんモード）', kind: 'base',
		input: { faceType: 'standard', framing: 'half_body', groupSize: 'solo', skinTone: 'normal' },
	},
	{
		id: 2, label: 'ベース: 標準/全身/ソロ/通常/屋外昼/明るく', kind: 'base',
		input: { faceType: 'standard', framing: 'full_body', groupSize: 'solo', skinTone: 'normal', location: 'outdoor', timeOfDay: 'day', mood: 'bright' },
	},
	{
		id: 3, label: 'ベース: 丸め/半身/ソロ/褐色/ドール感', kind: 'base',
		input: { faceType: 'round_small', framing: 'half_body', groupSize: 'solo', skinTone: 'tan', mood: 'doll_like' },
	},
	{
		id: 4, label: 'ベース: 角/全身/複数人/青肌/屋外夜/かっこよく', kind: 'base',
		input: { faceType: 'angular', framing: 'full_body', groupSize: 'group', skinTone: 'blue', location: 'outdoor', timeOfDay: 'night', mood: 'cool' },
	},
	// 境界ケース: 極端な条件
	{
		id: 5, label: '境界: 異色白/スタジオ/フラット', kind: 'boundary',
		input: { faceType: 'standard', framing: 'half_body', groupSize: 'solo', skinTone: 'light_exotic', location: 'studio', shadowPref: 'flat' },
	},
	{
		id: 6, label: '境界: 異色黒/屋外夜/エモい/陰影強め', kind: 'boundary',
		input: { faceType: 'round_small', framing: 'full_body', groupSize: 'solo', skinTone: 'dark_exotic', location: 'outdoor', timeOfDay: 'night', shadowPref: 'strong', mood: 'emotional' },
	},
	{
		id: 7, label: '境界: 角/半身/逆光/屋外昼', kind: 'boundary',
		input: { faceType: 'angular', framing: 'half_body', groupSize: 'solo', skinTone: 'normal', location: 'outdoor', timeOfDay: 'day', backlight: true },
	},
	{
		id: 8, label: '境界: 褐色/全身/夜/陰影強め/寒色/ツヤ', kind: 'boundary',
		input: { faceType: 'standard', framing: 'full_body', groupSize: 'solo', skinTone: 'tan', location: 'outdoor', timeOfDay: 'night', shadowPref: 'strong', ambientColor: 'cool', texturePref: 'glossy' },
	},
	// 対照ケース: 1条件だけ変えたペア
	{
		id: 9, label: '対照A: 標準/半身/屋外【昼】/自然', kind: 'contrast', contrastPair: 10,
		input: { faceType: 'standard', framing: 'half_body', groupSize: 'solo', skinTone: 'normal', location: 'outdoor', timeOfDay: 'day', shadowPref: 'natural', mood: 'bright' },
	},
	{
		id: 10, label: '対照A: 標準/半身/屋外【夜】/自然', kind: 'contrast', contrastPair: 9,
		input: { faceType: 'standard', framing: 'half_body', groupSize: 'solo', skinTone: 'normal', location: 'outdoor', timeOfDay: 'night', shadowPref: 'natural', mood: 'bright' },
	},
	{
		id: 11, label: '対照B: 標準/半身/屋外夜/【自然に明るく】', kind: 'contrast', contrastPair: 12,
		input: { faceType: 'standard', framing: 'half_body', groupSize: 'solo', skinTone: 'normal', location: 'outdoor', timeOfDay: 'night', mood: 'bright' },
	},
	{
		id: 12, label: '対照B: 標準/半身/屋外夜/【エモい・暗め】', kind: 'contrast', contrastPair: 11,
		input: { faceType: 'standard', framing: 'half_body', groupSize: 'solo', skinTone: 'normal', location: 'outdoor', timeOfDay: 'night', mood: 'emotional' },
	},
];

// ─── Gemini API ───

const responseSchema = {
	type: 'OBJECT',
	properties: {
		lights: {
			type: 'ARRAY',
			items: {
				type: 'OBJECT',
				properties: {
					id: { type: 'INTEGER' },
					role: { type: 'STRING' },
					type: { type: 'INTEGER' },
					rgb: {
						type: 'OBJECT',
						properties: { r: { type: 'INTEGER' }, g: { type: 'INTEGER' }, b: { type: 'INTEGER' } },
						required: ['r', 'g', 'b'],
					},
					direction: { type: 'STRING' },
					vertical_angle: { type: 'STRING' },
					tip: { type: 'STRING' },
				},
				required: ['id', 'role', 'type', 'rgb', 'direction', 'vertical_angle', 'tip'],
			},
		},
		character_lighting: { type: 'INTEGER' },
		brightness_manual: { type: 'INTEGER' },
		notes: { type: 'STRING' },
	},
	required: ['lights', 'character_lighting', 'brightness_manual', 'notes'],
};

async function callGemini(systemPrompt: string, userPrompt: string): Promise<AdvisorResponse> {
	const res = await fetch(GEMINI_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY! },
		body: JSON.stringify({
			system_instruction: { parts: [{ text: systemPrompt }] },
			contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
			generationConfig: { responseMimeType: 'application/json', responseSchema, temperature: 0.1 },
		}),
	});
	if (!res.ok) throw new Error(`Gemini API error (${res.status}): ${await res.text()}`);
	const data = await res.json();
	const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
	if (!text) throw new Error('Empty response');
	return JSON.parse(text);
}

// ─── User Prompt Builder ───

function buildUserPrompt(input: Record<string, unknown>): string {
	const lines = ['以下の条件でライティング設定を提案してください。', ''];

	for (const [key, value] of Object.entries(input)) {
		const labelMap = LABEL_MAP[key];
		if (key === 'backlight') {
			lines.push(`逆光: ${value ? 'あり' : 'なし'}`);
		} else if (labelMap && typeof value === 'string') {
			const fieldLabels: Record<string, string> = {
				faceType: '顔の輪郭タイプ',
				framing: 'フレーミング',
				groupSize: '人数',
				skinTone: '肌色タイプ',
				location: '撮影場所',
				timeOfDay: '時間帯',
				ambientColor: '環境光の色',
				shadowPref: '影の好み',
				texturePref: '質感の好み',
				mood: '雰囲気',
			};
			lines.push(`${fieldLabels[key] ?? key}: ${labelMap[value] ?? value}`);
		}
	}
	return lines.join('\n');
}

// ─── Metrics ───

// 旧プロンプトに埋め込まれていた固定RGB値
const OLD_TEMPLATE_RGBS = [
	{ r: 70, g: 70, b: 70 },
	{ r: 40, g: 40, b: 40 },
	{ r: 50, g: 50, b: 50 },
	{ r: 90, g: 90, b: 90 },
	{ r: 30, g: 30, b: 30 },
	{ r: 60, g: 60, b: 60 },
	{ r: 100, g: 60, b: 40 },
	{ r: 40, g: 60, b: 100 },
	{ r: 80, g: 65, b: 60 },
];

function rgbMatch(a: RGB, b: RGB): boolean {
	return a.r === b.r && a.g === b.g && a.b === b.b;
}

function rgbDistance(a: RGB, b: RGB): number {
	return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function rgbKey(rgb: RGB): string {
	return `${rgb.r},${rgb.g},${rgb.b}`;
}

function countTemplateMatches(response: AdvisorResponse): number {
	let count = 0;
	for (const light of response.lights) {
		if (OLD_TEMPLATE_RGBS.some((t) => rgbMatch(light.rgb, t))) count++;
	}
	return count;
}

function checkConstraints(response: AdvisorResponse): string[] {
	const violations: string[] = [];
	if (response.lights.length !== 3) violations.push('ライト数が3でない');
	for (const light of response.lights) {
		for (const ch of ['r', 'g', 'b'] as const) {
			if (light.rgb[ch] < 0 || light.rgb[ch] > 255) violations.push(`ライト${light.id} ${ch}=${light.rgb[ch]} 範囲外`);
		}
	}
	if (response.character_lighting < 0 || response.character_lighting > 100) {
		violations.push(`character_lighting=${response.character_lighting} 範囲外(0-100)`);
	}
	if (response.brightness_manual < 0 || response.brightness_manual > 200) {
		violations.push(`brightness_manual=${response.brightness_manual} 範囲外(0-200)`);
	}
	return violations;
}

function contrastSensitivity(a: AdvisorResponse, b: AdvisorResponse): number {
	let totalDist = 0;
	for (let i = 0; i < 3; i++) {
		totalDist += rgbDistance(a.lights[i].rgb, b.lights[i].rgb);
	}
	return totalDist / 3;
}

// ─── Runner ───

async function runBenchmark() {
	console.log('=== Po-Light プロンプトベンチマーク ===\n');
	// --old フラグで旧プロンプトも実行、デフォルトは新プロンプトのみ
	const runOld = process.argv.includes('--old');
	const promptsToRun = runOld
		? { old: OLD_PROMPT, new: NEW_PROMPT }
		: { new: NEW_PROMPT };
	const totalCalls = TEST_CASES.length * Object.keys(promptsToRun).length;
	console.log(`テストケース: ${TEST_CASES.length}件 × ${Object.keys(promptsToRun).join('/')} = ${totalCalls}コール\n`);

	const results: RunResult[] = [];

	for (const tc of TEST_CASES) {
		const userPrompt = buildUserPrompt(tc.input);
		for (const [label, systemPrompt] of Object.entries(promptsToRun)) {
			const tag = `[#${tc.id} ${label}]`;
			try {
				process.stdout.write(`${tag} ${tc.label} ... `);
				const response = await callGemini(systemPrompt, userPrompt);
				results.push({ testId: tc.id, prompt: label as 'old' | 'new', response });
				console.log('OK');
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				results.push({ testId: tc.id, prompt: label as 'old' | 'new', response: null, error: msg });
				console.log(`ERROR: ${msg}`);
			}
			// レートリミット対策
			await new Promise((r) => setTimeout(r, 1000));
		}
	}

	// ─── Analysis ───

	console.log('\n\n========================================');
	console.log('  分析結果');
	console.log('========================================\n');

	for (const promptType of ['old', 'new'] as const) {
		const runs = results.filter((r) => r.prompt === promptType && r.response);
		const label = promptType === 'old' ? '旧プロンプト' : '新プロンプト';

		console.log(`--- ${label} ---`);

		// 1. テンプレート一致率
		let totalLights = 0;
		let templateMatches = 0;
		for (const run of runs) {
			const matches = countTemplateMatches(run.response!);
			templateMatches += matches;
			totalLights += 3;
		}
		console.log(`  テンプレートRGB一致: ${templateMatches}/${totalLights} (${((templateMatches / totalLights) * 100).toFixed(1)}%)`);

		// 2. ユニークRGB率
		const allRgbs = runs.flatMap((r) => r.response!.lights.map((l) => rgbKey(l.rgb)));
		const uniqueRgbs = new Set(allRgbs);
		console.log(`  ユニークRGB: ${uniqueRgbs.size}/${allRgbs.length} (${((uniqueRgbs.size / allRgbs.length) * 100).toFixed(1)}%)`);

		// 3. 制約違反
		let totalViolations = 0;
		for (const run of runs) {
			const v = checkConstraints(run.response!);
			totalViolations += v.length;
			if (v.length > 0) console.log(`  ⚠ #${run.testId}: ${v.join(', ')}`);
		}
		console.log(`  制約違反: ${totalViolations}件`);

		// 4. エラー
		const errors = results.filter((r) => r.prompt === promptType && r.error);
		if (errors.length > 0) console.log(`  APIエラー: ${errors.length}件`);

		console.log();
	}

	// 5. 対照ケースの感度比較
	console.log('--- 対照ケース感度（条件変更時のRGB距離） ---');
	const contrastPairs = [[9, 10], [11, 12]];
	for (const [aId, bId] of contrastPairs) {
		const tcA = TEST_CASES.find((t) => t.id === aId)!;
		const tcB = TEST_CASES.find((t) => t.id === bId)!;
		console.log(`  ペア #${aId} ↔ #${bId}: ${tcA.label.split(':')[1]?.trim()} vs ${tcB.label.split(':')[1]?.trim()}`);

		for (const promptType of ['old', 'new'] as const) {
			const a = results.find((r) => r.testId === aId && r.prompt === promptType && r.response);
			const b = results.find((r) => r.testId === bId && r.prompt === promptType && r.response);
			if (a?.response && b?.response) {
				const dist = contrastSensitivity(a.response, b.response);
				console.log(`    ${promptType === 'old' ? '旧' : '新'}: 平均RGB距離 = ${dist.toFixed(1)}`);
			} else {
				console.log(`    ${promptType === 'old' ? '旧' : '新'}: データなし`);
			}
		}
	}

	// 6. 全結果テーブル
	console.log('\n\n--- 全結果一覧 ---');
	console.log('ID | Prompt | L1 RGB        | L2 RGB        | L3 RGB        | CL  | BM  | Notes (先頭40字)');
	console.log('---|--------|---------------|---------------|---------------|-----|-----|------------------');
	for (const run of results) {
		if (!run.response) {
			console.log(`${String(run.testId).padStart(2)} | ${run.prompt.padEnd(6)} | ERROR: ${run.error}`);
			continue;
		}
		const r = run.response;
		const fmtRgb = (rgb: RGB) => `(${String(rgb.r).padStart(3)},${String(rgb.g).padStart(3)},${String(rgb.b).padStart(3)})`;
		const notes = r.notes.slice(0, 40).replace(/\n/g, ' ');
		console.log(
			`${String(run.testId).padStart(2)} | ${run.prompt.padEnd(6)} | ${fmtRgb(r.lights[0].rgb)} | ${fmtRgb(r.lights[1].rgb)} | ${fmtRgb(r.lights[2].rgb)} | ${String(r.character_lighting).padStart(3)} | ${String(r.brightness_manual).padStart(3)} | ${notes}`
		);
	}
}

runBenchmark().catch(console.error);
