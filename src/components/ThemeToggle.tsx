'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'terminus-theme';

function getSystemTheme(): Theme {
	if (typeof window === 'undefined') return 'dark';
	return window.matchMedia?.('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark';
}

function readStoredTheme(): Theme | null {
	if (typeof window === 'undefined') return null;
	try {
		const val = window.localStorage.getItem(STORAGE_KEY);
		return val === 'light' || val === 'dark' ? val : null;
	} catch {
		return null;
	}
}

function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme;
}

function persistTheme(theme: Theme) {
	try {
		window.localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		// ignore
	}
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('dark');

	const label = useMemo(() => (theme === 'dark' ? 'Dark' : 'Light'), [theme]);

	useEffect(() => {
		const initial = readStoredTheme() ?? getSystemTheme();
		setTheme(initial);
		applyTheme(initial);
	}, []);

	const toggle = useCallback(() => {
		setTheme((prev) => {
			const next: Theme = prev === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			persistTheme(next);
			return next;
		});
	}, []);

	return (
		<button type="button" className="themeToggle" onClick={toggle} aria-label="Toggle light/dark mode">
			<span>Theme</span>
			<span className="themeTogglePill">{label}</span>
		</button>
	);
}

