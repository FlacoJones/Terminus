'use client';

import { useState } from 'react';
import styles from './APIForm.module.css';
import { REVIEW_SECTIONS, FIELD_LABELS, formatValue } from '@/types/forms';
import type { FormReadyState } from './APIForm';

const OTHER_FIELD_PARENTS: Record<string, { field: string; trigger: string }> = {
	temperatureRiseOther: { field: 'temperatureRise', trigger: 'other' },
	oilTypeOther: { field: 'oilType', trigger: 'other' },
	corrosionClassCustom: { field: 'corrosionClass', trigger: 'custom' },
};

function shouldShowField(fieldName: string, values: Record<string, string | string[]>): boolean {
	const parent = OTHER_FIELD_PARENTS[fieldName];
	if (!parent) return true;
	return values[parent.field] === parent.trigger;
}

function renderValue(fieldName: string, raw: string | string[] | undefined): string {
	if (raw === undefined || raw === '') return '';
	if (Array.isArray(raw)) {
		return raw.map((v) => formatValue(v)).join(', ');
	}
	return formatValue(raw);
}

export function ReviewPanel({
	formValues,
	readyState,
}: {
	formValues: Record<string, string | string[]>;
	readyState: FormReadyState;
}) {
	const [consentChecked, setConsentChecked] = useState(false);
	const hasAnyValue = Object.keys(formValues).length > 0;

	const { allComplete, hasValidationErrors, submitting, submitError } = readyState;
	const canSubmit = allComplete && !hasValidationErrors && !submitting && consentChecked;

	return (
		<div className={styles.reviewPanel}>
			<div className={styles.reviewHeader}>
				<span className={styles.reviewHeaderTitle}>Spec Review</span>
			</div>

			{REVIEW_SECTIONS.map((section, sIdx) => {
				const visibleFields = section.fields.filter((f) => shouldShowField(f, formValues));

				return (
					<div key={section.title} className={styles.reviewSection}>
						<div className={styles.reviewSectionTitle}>
							<span className={styles.reviewSectionIndex}>
								{String(sIdx + 1).padStart(2, '0')}
							</span>
							{section.title.replace(/^\d+\.\s*/, '')}
						</div>

						<div className={styles.reviewFields}>
							{visibleFields.map((fieldName) => {
								const label = FIELD_LABELS[fieldName] ?? fieldName;
								const display = renderValue(fieldName, formValues[fieldName]);

								return (
									<div key={fieldName} className={styles.reviewRow}>
										<span className={styles.reviewLabel}>{label}</span>
										{display ? (
											<span className={styles.reviewValue}>{display}</span>
										) : (
											<span className={styles.reviewValueEmpty}>---</span>
										)}
									</div>
								);
							})}
						</div>
					</div>
				);
			})}

			{!hasAnyValue && (
				<p className={styles.reviewEmptyHint}>
					Fill in the form on the left to see your specification here.
				</p>
			)}

			<div className={styles.reviewSubmitArea}>
				<label className={styles.consentLabel}>
					<input
						type="checkbox"
						checked={consentChecked}
						onChange={(e) => setConsentChecked(e.target.checked)}
						className={styles.consentCheckbox}
					/>
					<span className={styles.consentText}>
						I understand that this is an Advance Purchase Indication to demonstrate
						intention, but not obligation, to follow through with purchase.
					</span>
				</label>

				<div className={styles.submitWrapper}>
					<button
						type="submit"
						form="nbpoForm"
						className={styles.submitBtn}
						disabled={!canSubmit}
					>
						{submitting ? 'Submitting...' : 'Submit Advance Purchase Indication'}
					</button>
					{!canSubmit && !submitting && (
						<span className={styles.submitTooltip}>
							{hasValidationErrors
								? 'Please fix the validation errors above before submitting.'
								: !allComplete
									? 'Please complete all fields before submitting.'
									: !consentChecked
										? 'Please acknowledge the consent statement above.'
										: ''}
						</span>
					)}
				</div>
				{submitError && (
					<p className={styles.submitError}>Submission failed: {submitError}</p>
				)}
			</div>
		</div>
	);
}
