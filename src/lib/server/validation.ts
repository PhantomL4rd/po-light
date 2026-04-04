import { z } from 'zod';
import type { AdvisorResponse, DetailedInput } from '$lib/types';

const inputSchema = z.object({
	faceType: z.enum(['round_small', 'standard', 'angular']),
	framing: z.enum(['half_body', 'full_body']),
	groupSize: z.enum(['solo', 'group']),
	skinTone: z.enum(['normal', 'tan', 'blue', 'dark_exotic', 'light_exotic']),
	location: z.enum(['studio', 'outdoor']).optional(),
	timeOfDay: z.enum(['morning', 'day', 'evening', 'night']).optional(),
	weather: z.enum(['sunny', 'cloudy', 'rainy']).optional(),
	backlight: z.boolean().optional(),
	sunExposure: z.enum(['direct', 'shade']).optional(),
	ambientColor: z.enum(['warm', 'cool', 'neutral', 'none']).optional(),
	shadowPref: z.enum(['strong', 'natural', 'flat']).optional(),
	texturePref: z.enum(['glossy', 'matte', 'natural']).optional()
});

const rgbSchema = z.object({
	r: z.number().int().min(0).max(255),
	g: z.number().int().min(0).max(255),
	b: z.number().int().min(0).max(255)
});

const lightConfigSchema = z.object({
	id: z.number(),
	role: z.string().nullable(),
	type: z.number().nullable(),
	rgb: rgbSchema.nullable(),
	direction: z.string().nullable(),
	vertical_angle: z.string().nullable(),
	tip: z.string().nullable()
});

const advisorResponseSchema = z.object({
	lights: z.tuple([lightConfigSchema, lightConfigSchema, lightConfigSchema]),
	character_lighting: z.number().int().min(0).max(100),
	brightness_manual: z.number().int().min(0).max(200),
	notes: z.string()
});

export function validateInput(data: unknown): DetailedInput {
	return inputSchema.parse(data);
}

export function validateAdvisorResponse(data: unknown): AdvisorResponse {
	return advisorResponseSchema.parse(data) as AdvisorResponse;
}
