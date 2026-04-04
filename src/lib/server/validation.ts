import { z } from 'zod';
import type { AdvisorResponse, DetailedInput } from '$lib/types';

const inputSchema = z.object({
	faceType: z.enum(['round_small', 'standard', 'angular']),
	framing: z.enum(['half_body', 'full_body']),
	groupSize: z.enum(['solo', 'group']),
	skinTone: z.enum(['normal', 'tan', 'blue', 'dark_exotic', 'light_exotic']),
	location: z.enum(['studio', 'outdoor']).optional(),
	timeOfDay: z.enum(['day', 'night']).optional(),
	backlight: z.boolean().optional(),
	ambientColor: z.enum(['warm', 'cool', 'neutral', 'none']).optional(),
	shadowPref: z.enum(['strong', 'natural', 'flat']).optional(),
	texturePref: z.enum(['glossy', 'matte', 'natural']).optional(),
	mood: z.enum(['bright', 'doll_like', 'emotional', 'cool']).optional()
});

const rgbSchema = z.object({
	r: z.number().int().min(0).max(255),
	g: z.number().int().min(0).max(255),
	b: z.number().int().min(0).max(255)
});

const lightConfigSchema = z.object({
	id: z.number(),
	role: z.string(),
	type: z.number(),
	rgb: rgbSchema,
	direction: z.string(),
	vertical_angle: z.string(),
	tip: z.string()
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
