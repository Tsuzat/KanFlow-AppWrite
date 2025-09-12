import { browser } from '$app/environment';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { clsx, type ClassValue } from 'clsx';
import { LexoRank } from 'lexorank';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Checks if the current browser is in macOS.
 */
export const ISMAC =
	browser &&
	(navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS X'));

export const getKeyboardShortcut = (key: string, ctrl = false, shift = false, alt = false) => {
	const modifiers: string[] = [];
	if (ISMAC) {
		if (ctrl) modifiers.push('⌘');
		if (shift) modifiers.push('⇧');
		if (alt) modifiers.push('⌥');
	} else {
		if (ctrl) modifiers.push('Ctrl');
		if (shift) modifiers.push('Shift');
		if (alt) modifiers.push('Alt');
	}

	return [...modifiers, key].join(' ');
};

/**
 * Generates a LexoRank key that falls lexicographically between prevKey and nextKey.
 * This function leverages the 'lexorank' npm package for robust key generation.
 *
 * @param prevKey The LexoRank key before the desired new key (can be null if it's the first item).
 * @param nextKey The LexoRank key after the desired new key (can be null if it's the last item).
 * @returns A new LexoRank string that orders correctly between prevKey and nextKey.
 * @throws {Error} If both prevKey and nextKey are null, indicating an attempt to place the first item,
 * but LexoRank.middle() is not explicitly handled or if parsing fails.
 */
export function generateKeyBetween(prevKey: string | null, nextKey: string | null): string {
	let newLexoRank: LexoRank;

	if (prevKey === null && nextKey === null) {
		newLexoRank = LexoRank.middle();
	} else if (prevKey === null) {
		const nextLexoRank = LexoRank.parse(nextKey!); // '!' asserts non-null
		newLexoRank = nextLexoRank.genPrev();
	} else if (nextKey === null) {
		const prevLexoRank = LexoRank.parse(prevKey);
		newLexoRank = prevLexoRank.genNext();
	} else {
		const prevLexoRank = LexoRank.parse(prevKey);
		const nextLexoRank = LexoRank.parse(nextKey);
		newLexoRank = prevLexoRank.between(nextLexoRank);
	}

	return newLexoRank.toString();
}

interface FormattedDateResult {
	display?: string;
	isPassed: boolean;
}

/**
 * Function to format a date with a check mark if it is in the past.
 * @param isoString ISO 8601 date string
 * @returns FormattedDateResult - {display: string, isPassed: boolean}
 */
export function formatDateWithCheck(isoString?: string): FormattedDateResult {
	if (!isoString) return { display: undefined, isPassed: false };
	// Extract date part only (YYYY-MM-DD)
	const dateOnly = isoString.split('T')[0];
	const inputDate = parseDate(dateOnly);
	const currentDate = today(getLocalTimeZone());
	const isPassed = inputDate.compare(currentDate) < 0;
	const day = inputDate.day.toString().padStart(2, '0');
	const jsDate = inputDate.toDate(getLocalTimeZone());
	const month = jsDate.toLocaleString('default', { month: 'short' });
	const display = `${day} ${month}, ${inputDate.year}`;
	return { display, isPassed };
}
