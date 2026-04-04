import type { AdvisorResponse, DetailedInput } from '$lib/types';

const STORAGE_KEY = 'po-light-history';

export interface HistoryEntry {
	id: string;
	input: DetailedInput;
	output: AdvisorResponse;
	rating: number;
	createdAt: string;
}

export function saveToHistory(
	input: DetailedInput,
	output: AdvisorResponse,
	rating: number
): HistoryEntry {
	const entry: HistoryEntry = {
		id: crypto.randomUUID(),
		input,
		output,
		rating,
		createdAt: new Date().toISOString()
	};

	const history = getHistory();
	history.unshift(entry);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	return entry;
}

export function getHistory(): HistoryEntry[] {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as HistoryEntry[];
	} catch {
		return [];
	}
}
