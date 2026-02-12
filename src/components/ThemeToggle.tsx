'use client';

import { useCallback, useEffect, useState } from 'react';

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

function SunIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
				fill="currentColor"
			/>
			<path
				d="M12 2v2.2M12 19.8V22M4.2 12H2M22 12h-2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M21 14.6A8.5 8.5 0 0 1 9.4 3a7.3 7.3 0 1 0 11.6 11.6Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.6"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		// Keep theme changes scoped to where this component is mounted.
		const prev = document.documentElement.dataset.theme;

		const initial = readStoredTheme() ?? getSystemTheme();
		setTheme(initial);
		applyTheme(initial);

		return () => {
			if (prev) {
				document.documentElement.dataset.theme = prev;
			} else {
				delete document.documentElement.dataset.theme;
			}
		};
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
		<button
			type="button"
			className="themeToggle"
			data-theme={theme}
			onClick={toggle}
			role="switch"
			aria-checked={theme === 'dark'}
			aria-label="Toggle light/dark mode"
		>
			<span className="themeToggleThumb">
				{theme === 'light' ? <SunIcon className="themeToggleIcon" /> : <MoonIcon className="themeToggleIcon" />}
			</span>
		</button>
	);
}

