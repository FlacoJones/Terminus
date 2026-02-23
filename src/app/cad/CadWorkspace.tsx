'use client';

import { useState, useCallback, Suspense } from 'react';
import styles from './APIForm.module.css';
import { APIForm, type FormReadyState } from './APIForm';
import { ReviewPanel } from './ReviewPanel';

function FormLoadingFallback() {
	return (
		<div style={{ textAlign: 'center', padding: '2rem', color: 'var(--brand-gray)' }}>
			Loading...
		</div>
	);
}

export function CadWorkspace() {
	const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});
	const [readyState, setReadyState] = useState<FormReadyState>({
		allComplete: false,
		hasValidationErrors: false,
		submitting: false,
		submitError: null,
	});

	const handleFormChange = useCallback((values: Record<string, string | string[]>) => {
		setFormValues(values);
	}, []);

	const handleReadyStateChange = useCallback((state: FormReadyState) => {
		setReadyState(state);
	}, []);

	return (
		<main className={styles.cadLayout}>
			<aside className={styles.sidebar}>
				<div className={styles.sidebarHeader}>
					<h1 className={styles.sidebarTitle}>Transformer Spec</h1>
					<p className={styles.sidebarSubtitle}>Advance Purchase Indication</p>
				</div>

				<div className={styles.sidebarContent}>
					<Suspense fallback={<FormLoadingFallback />}>
						<APIForm
							onFormChange={handleFormChange}
							onReadyStateChange={handleReadyStateChange}
						/>
					</Suspense>
				</div>
			</aside>

			<div className={styles.canvas}>
				<ReviewPanel formValues={formValues} readyState={readyState} />
			</div>
		</main>
	);
}
