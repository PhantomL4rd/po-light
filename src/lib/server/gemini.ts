const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiResponse {
	candidates?: Array<{
		content?: {
			parts?: Array<{
				text?: string;
			}>;
		};
	}>;
}

const responseSchema = {
	type: 'OBJECT',
	properties: {
		lights: {
			type: 'ARRAY',
			description: 'ライト1〜3の設定。必ず3つ。',
			items: {
				type: 'OBJECT',
				properties: {
					id: { type: 'INTEGER', description: 'ライト番号（1, 2, 3）' },
					role: { type: 'STRING', description: '役割名（例: メインライト（キーライト））' },
					type: { type: 'INTEGER', description: 'タイプ（1=狭い, 2=中, 3=広い）' },
					rgb: {
						type: 'OBJECT',
						properties: {
							r: { type: 'INTEGER', description: '0〜255' },
							g: { type: 'INTEGER', description: '0〜255' },
							b: { type: 'INTEGER', description: '0〜255' }
						},
						required: ['r', 'g', 'b']
					},
					direction: { type: 'STRING', description: 'ライトの方向' },
					vertical_angle: { type: 'STRING', description: '垂直角度' },
					tip: { type: 'STRING', description: '設置時のヒント' }
				},
				required: ['id', 'role', 'type', 'rgb', 'direction', 'vertical_angle', 'tip']
			}
		},
		character_lighting: {
			type: 'INTEGER',
			description: 'キャラクターライティング値（0〜100）'
		},
		brightness_manual: {
			type: 'INTEGER',
			description: '明るさのマニュアル調整値（0〜200）'
		},
		notes: {
			type: 'STRING',
			description: 'アドバイスや注意点（自然言語で補足）'
		}
	},
	required: ['lights', 'character_lighting', 'brightness_manual', 'notes']
};

export async function callGemini(
	apiKey: string,
	systemPrompt: string,
	userPrompt: string
): Promise<unknown> {
	const response = await fetch(GEMINI_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-goog-api-key': apiKey
		},
		body: JSON.stringify({
			system_instruction: {
				parts: [{ text: systemPrompt }]
			},
			contents: [
				{
					role: 'user',
					parts: [{ text: userPrompt }]
				}
			],
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema,
				temperature: 0.1
			}
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error(`Gemini API error (${response.status}):`, errorText);
		throw new Error(`Gemini API error (${response.status})`);
	}

	const data: GeminiResponse = await response.json();
	const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

	if (!text) {
		console.error('Gemini raw response:', JSON.stringify(data, null, 2));
		throw new Error('Gemini API returned empty response');
	}

	return JSON.parse(text);
}
