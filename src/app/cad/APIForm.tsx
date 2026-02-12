'use client';

import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import styles from './APIForm.module.css';
import { submitAPIForm } from '@/actions/email';
import { SuccessModal } from '@/components';
import type { APISubmission } from '@/types/forms';

const HIDE_DEBUG = true;
const SHOW_AUTOFILL = true;

const DEBUG_DATA = {
	companyName: 'Acme Power Corp',
	projectName: 'Desert Solar Farm Phase 2',
	siteAddress: '34.0522° N, 118.2437° W',
	contactName: 'John Smith',
	contactEmail: 'john.smith@acmepower.com',
	contactPhone: '+1 (555) 123-4567',
	hvRating: '138',
	lvRating: '34.5',
	mvaRating: '100',
	frequency: '60Hz',
	phase: '3-phase',
	vectorGroup: 'Δ-Y',
	groundingPreference: 'Solidly grounded',
	targetImpedance: '8.5',
	noLoadLoss: '45000',
	loadLoss: '280000',
	temperatureRise: '65C',
	soundLevel: 'lowNoise',
	soundLimit: '65',
	tapChangerType: 'OLTC',
	tapRange: '±10%',
	tapSteps: '32',
	tapLocation: 'HV',
	hvBil: '550',
	lvBil: '200',
	surgeRequirements: 'enhanced',
	maxShippingWeight: '180',
	maxHeight: '4.5',
	maxWidth: '4.0',
	maxLength: '8.0',
	seismicRating: 'zone4',
	siteFootprint: 'Max pad area 15m x 20m. No overhead obstructions. East-west orientation preferred.',
	coolingClass: 'ONAF',
	coolingRedundancy: 'N+1',
	oilType: 'naturalEster',
	corrosionClass: 'heavyIndustrial',
	noiseBarriers: 'no',
	altitude: '350',
	maxAmbient: '45',
	minAmbient: '-10',
	testing: ['standardRoutine', 'temperatureRise', 'lightningImpulse', 'FRA'],
	partialDischargeLimit: '300',
	optionalUploads: ['utilitySpec'],
	governingStandards: 'IEEEC57',
	additionalNotes: 'Require factory witness testing. Delivery to be coordinated with site preparation schedule.',
};

/* ─── Section field names (for completion tracking) ─── */

const SECTION_FIELDS: Record<number, string[]> = {
	1: ['companyName', 'projectName', 'siteAddress', 'contactName', 'contactEmail', 'contactPhone'],
	2: ['hvRating', 'lvRating', 'mvaRating', 'frequency', 'phase', 'vectorGroup', 'groundingPreference'],
	3: ['targetImpedance', 'noLoadLoss', 'loadLoss', 'temperatureRise', 'soundLevel', 'soundLimit'],
	4: ['tapChangerType', 'tapRange', 'tapSteps', 'tapLocation'],
	5: ['hvBil', 'lvBil', 'surgeRequirements'],
	6: ['maxShippingWeight', 'maxHeight', 'maxWidth', 'maxLength', 'seismicRating', 'siteFootprint'],
	7: ['coolingClass', 'coolingRedundancy', 'oilType'],
	8: ['corrosionClass', 'noiseBarriers', 'altitude', 'maxAmbient', 'minAmbient'],
	9: ['testing', 'partialDischargeLimit'],
	10: ['governingStandards'],
	11: ['additionalNotes'],
};

/* ─── Validation rules ─── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-().]+$/;

type Validator = (value: string) => string | null;

/** Returns null if valid, or an error message string */
const FIELD_VALIDATORS: Record<string, Validator> = {
	// Section 1
	companyName: (v) => (v.trim() && v.trim().length < 2 ? 'Must be at least 2 characters.' : null),
	projectName: (v) => (v.trim() && v.trim().length < 2 ? 'Must be at least 2 characters.' : null),
	siteAddress: (v) => (v.trim() && v.trim().length < 3 ? 'Must be at least 3 characters.' : null),
	contactName: (v) => (v.trim() && v.trim().length < 2 ? 'Must be at least 2 characters.' : null),
	contactEmail: (v) => (v.trim() && !EMAIL_RE.test(v.trim()) ? 'Enter a valid email address.' : null),
	contactPhone: (v) => {
		if (!v.trim()) return null; // optional, but validated if entered
		if (!PHONE_RE.test(v.trim())) return 'Only digits, spaces, +, -, (, ) allowed.';
		const digits = v.replace(/\D/g, '');
		if (digits.length < 7) return 'Phone number must have at least 7 digits.';
		if (digits.length > 15) return 'Phone number is too long (max 15 digits).';
		return null;
	},

	// Section 2
	hvRating: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	lvRating: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	mvaRating: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	groundingPreference: () => null,

	// Section 3
	targetImpedance: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	noLoadLoss: (v) => (v && (isNaN(Number(v)) || Number(v) < 0) ? 'Must be a non-negative number.' : null),
	loadLoss: (v) => (v && (isNaN(Number(v)) || Number(v) < 0) ? 'Must be a non-negative number.' : null),
	soundLimit: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),

	// Section 4
	tapRange: () => null,
	tapSteps: (v) => {
		if (!v.trim()) return null;
		const n = Number(v);
		if (isNaN(n) || !Number.isInteger(n) || n <= 0) return 'Must be a positive whole number.';
		return null;
	},

	// Section 5
	hvBil: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	lvBil: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),

	// Section 6
	maxShippingWeight: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	maxHeight: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	maxWidth: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	maxLength: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),
	siteFootprint: () => null,

	// Section 8
	altitude: (v) => (v && (isNaN(Number(v)) || Number(v) < 0) ? 'Must be a non-negative number.' : null),
	maxAmbient: (v) => {
		if (!v.trim()) return null;
		const n = Number(v);
		if (isNaN(n)) return 'Must be a number.';
		if (n < -60 || n > 70) return 'Must be between -60°C and 70°C.';
		return null;
	},
	minAmbient: (v) => {
		if (!v.trim()) return null;
		const n = Number(v);
		if (isNaN(n)) return 'Must be a number.';
		if (n < -60 || n > 70) return 'Must be between -60°C and 70°C.';
		return null;
	},

	// Section 9
	partialDischargeLimit: (v) => (v && (isNaN(Number(v)) || Number(v) <= 0) ? 'Must be a positive number.' : null),

	// Section 11
	additionalNotes: () => null,
};

/* ─── Checkmark SVG ─── */

function CheckIcon({ complete }: { complete: boolean }) {
	return (
		<svg
			className={`${styles.checkIcon} ${complete ? styles.checkIconComplete : styles.checkIconIncomplete}`}
			viewBox="0 0 20 20"
			aria-hidden="true"
		>
			<circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
			<path d="M6 10.4l2.5 2.5L14 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

/* ─── Collapsible Section Component ─── */

function Section({
	title,
	index,
	isOpen,
	onToggle,
	complete,
	children,
}: {
	title: string;
	index: number;
	isOpen: boolean;
	onToggle: () => void;
	complete: boolean;
	children: ReactNode;
}) {
	return (
		<div className={styles.section}>
			<button
				type="button"
				className={`${styles.sectionHeader} ${isOpen ? styles.sectionHeaderOpen : ''}`}
				onClick={onToggle}
				aria-expanded={isOpen}
			>
				<span className={styles.sectionIndex}>{String(index).padStart(2, '0')}</span>
				<span className={styles.sectionTitle}>{title}</span>
				<CheckIcon complete={complete} />
				<svg
					className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
				>
					<path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
			{/* Always render children so form state persists; hide with CSS */}
			<div className={`${styles.sectionBody} ${isOpen ? '' : styles.sectionBodyHidden}`}>
				{children}
			</div>
		</div>
	);
}

/* ─── Field Components ─── */

function Field({ label, htmlFor, error, children }: { label: string; htmlFor?: string; error?: string; children: ReactNode }) {
	return (
		<div className={styles.field}>
			{label && <label className={styles.fieldLabel} htmlFor={htmlFor}>{label}</label>}
			{children}
			{error && <span className={styles.fieldError}>{error}</span>}
		</div>
	);
}

function FieldRow({ children }: { children: ReactNode }) {
	return <div className={styles.fieldRow}>{children}</div>;
}

/* ─── Completion helper ─── */

function checkFieldFilled(form: HTMLFormElement, name: string): boolean {
	const elements = form.elements.namedItem(name);
	if (!elements) return false;

	if (elements instanceof RadioNodeList) {
		const firstEl = elements[0];
		if (firstEl instanceof HTMLInputElement && firstEl.type === 'radio') {
			return Array.from(elements).some((el) => el instanceof HTMLInputElement && el.checked);
		}
		if (firstEl instanceof HTMLInputElement && firstEl.type === 'checkbox') {
			return Array.from(elements).some((el) => el instanceof HTMLInputElement && el.checked);
		}
		return false;
	}

	if (elements instanceof HTMLInputElement) {
		if (elements.type === 'checkbox') return elements.checked;
		return elements.value.trim().length > 0;
	}
	if (elements instanceof HTMLTextAreaElement || elements instanceof HTMLSelectElement) {
		return elements.value.trim().length > 0;
	}
	return false;
}

function computeCompletion(form: HTMLFormElement): Record<number, boolean> {
	const result: Record<number, boolean> = {};
	for (const [key, fields] of Object.entries(SECTION_FIELDS)) {
		result[Number(key)] = fields.every((f) => checkFieldFilled(form, f));
	}
	return result;
}

/* ─── Validation helper ─── */

function validateField(name: string, value: string): string | null {
	const validator = FIELD_VALIDATORS[name];
	if (!validator) return null;
	return validator(value);
}

function validateAllFields(form: HTMLFormElement): Record<string, string> {
	const errors: Record<string, string> = {};
	for (const name of Object.keys(FIELD_VALIDATORS)) {
		const el = form.elements.namedItem(name);
		if (!el) continue;
		let value = '';
		if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
			value = el.value;
		}
		const err = validateField(name, value);
		if (err) errors[name] = err;
	}
	return errors;
}

/* ─── Input class helper ─── */

function inputClass(base: string | undefined, fieldName: string, errors: Record<string, string>): string {
	return errors[fieldName] ? `${base ?? ''} ${styles.inputError}` : (base ?? '');
}

/* ─── Main Form ─── */

export function APIForm() {
	const [openSections, setOpenSections] = useState<Set<number>>(new Set([1]));
	const [completion, setCompletion] = useState<Record<number, boolean>>({});
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const formRef = useRef<HTMLFormElement>(null);

	const allComplete = useMemo(
		() => Object.keys(SECTION_FIELDS).every((k) => completion[Number(k)]),
		[completion],
	);

	const hasValidationErrors = useMemo(
		() => Object.keys(fieldErrors).length > 0,
		[fieldErrors],
	);

	const toggleSection = useCallback((index: number) => {
		setOpenSections((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	}, []);

	/* Track form changes for completion indicators */
	const refreshCompletion = useCallback(() => {
		if (!formRef.current) return;
		setCompletion(computeCompletion(formRef.current));
	}, []);

	useEffect(() => {
		const form = formRef.current;
		if (!form) return;

		// Initial check (handles defaultChecked, etc.)
		refreshCompletion();

		form.addEventListener('input', refreshCompletion);
		form.addEventListener('change', refreshCompletion);
		return () => {
			form.removeEventListener('input', refreshCompletion);
			form.removeEventListener('change', refreshCompletion);
		};
	}, [refreshCompletion]);

	/* Validate a single field on blur — only if it has content (empty = not started yet) */
	const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (!name || !FIELD_VALIDATORS[name]) return;
		// If the field is empty, don't show an error — assume user hasn't filled it yet
		if (!value.trim()) {
			setFieldErrors((prev) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { [name]: _, ...rest } = prev;
				return rest;
			});
			return;
		}
		const err = validateField(name, value);
		setFieldErrors((prev) => {
			if (err) return { ...prev, [name]: err };
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [name]: _, ...rest } = prev;
			return rest;
		});
	}, []);

	/* Clear error on input so user gets immediate feedback */
	const handleInput = useCallback((e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement;
		const { name, value } = target;
		if (!name || !fieldErrors[name]) return;
		const err = validateField(name, value);
		if (!err) {
			setFieldErrors((prev) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { [name]: _, ...rest } = prev;
				return rest;
			});
		}
	}, [fieldErrors]);

	const handleDebugFill = useCallback(() => {
		const form = formRef.current;
		if (!form) return;

		// Open all sections for visibility
		setOpenSections(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));

		Object.entries(DEBUG_DATA).forEach(([key, value]) => {
			const elements = form.elements.namedItem(key);
			if (!elements) return;

			if (elements instanceof RadioNodeList) {
				const firstEl = elements[0];
				if (firstEl instanceof HTMLInputElement && firstEl.type === 'radio') {
					Array.from(elements).forEach((el) => {
						if (el instanceof HTMLInputElement && el.value === value) {
							el.checked = true;
						}
					});
				} else if (firstEl instanceof HTMLInputElement && firstEl.type === 'checkbox') {
					const values = Array.isArray(value) ? value : [value];
					Array.from(elements).forEach((el) => {
						if (el instanceof HTMLInputElement) {
							el.checked = values.includes(el.value);
						}
					});
				}
			} else if (elements instanceof HTMLInputElement) {
				if (elements.type === 'checkbox') {
					elements.checked = value === elements.value;
				} else {
					elements.value = String(value);
				}
			} else if (elements instanceof HTMLTextAreaElement || elements instanceof HTMLSelectElement) {
				elements.value = String(value);
			}
		});

		setFieldErrors({});
		refreshCompletion();
	}, [refreshCompletion]);

	// Handle "Other" text inputs
	useEffect(() => {
		const otherFields = [
			{ radio: 'temperatureRise', value: 'other', input: 'temperatureRiseOther' },
			{ radio: 'oilType', value: 'other', input: 'oilTypeOther' },
			{ radio: 'corrosionClass', value: 'custom', input: 'corrosionClassCustom' },
		];

		otherFields.forEach(({ radio, value, input }) => {
			const radios = document.querySelectorAll(`input[name="${radio}"]`);
			const textInput = document.querySelector(`input[name="${input}"]`) as HTMLInputElement;

			if (!textInput) return;

			radios.forEach((r) => {
				r.addEventListener('change', (e) => {
					const target = e.target as HTMLInputElement;
					textInput.disabled = target.value !== value || !target.checked;
					if (!textInput.disabled) textInput.focus();
				});
			});
		});
	}, []);

	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Run full validation before submit
		const form = e.currentTarget;
		const errors = validateAllFields(form);
		setFieldErrors(errors);
		if (Object.keys(errors).length > 0) {
			// Open any section that has an error and scroll to first
			for (const [secKey, fields] of Object.entries(SECTION_FIELDS)) {
				if (fields.some((f) => errors[f])) {
					setOpenSections((prev) => new Set([...prev, Number(secKey)]));
				}
			}
			return;
		}

		setSubmitting(true);
		setSubmitError(null);

		const formData = new FormData(form);
		const data: Record<string, string | string[]> = {};

		Array.from(formData.entries()).forEach(([key, value]) => {
			const existing = data[key];
			if (existing) {
				if (Array.isArray(existing)) {
					existing.push(value as string);
				} else {
					data[key] = [existing, value as string];
				}
			} else {
				data[key] = value as string;
			}
		});

		const now = new Date().toISOString();
		const submission: APISubmission = {
			...(data as unknown as APISubmission),
			id: crypto.randomUUID(),
			savedAt: now,
			submittedAt: now,
		};

		// Log the JSON for visibility
		console.warn('[API Submission]', JSON.stringify(submission, null, 2));

		try {
			const result = await submitAPIForm(submission);
			if (result.success) {
				console.warn('[API Submission] Emails sent successfully.');
				setShowSuccess(true);
			} else {
				console.error('[API Submission] Email failed:', result.error);
				setSubmitError(result.error ?? 'Failed to send email');
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Unknown error';
			console.error('[API Submission] Error:', msg);
			setSubmitError(msg);
		} finally {
			setSubmitting(false);
		}
	}, []);

	return (
		<form id="nbpoForm" ref={formRef} onSubmit={handleSubmit} className={styles.cadForm}>
			{/* 1. Basic Information */}
			<Section title="Basic Information" index={1} isOpen={openSections.has(1)} onToggle={() => toggleSection(1)} complete={!!completion[1]}>
				<Field label="Company Name" htmlFor="companyName" error={fieldErrors.companyName}>
					<input type="text" id="companyName" name="companyName" className={inputClass(styles.input, 'companyName', fieldErrors)} required onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<Field label="Project / Site Name" htmlFor="projectName" error={fieldErrors.projectName}>
					<input type="text" id="projectName" name="projectName" className={inputClass(styles.input, 'projectName', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<Field label="Site Address or GPS Coordinates" htmlFor="siteAddress" error={fieldErrors.siteAddress}>
					<input type="text" id="siteAddress" name="siteAddress" className={inputClass(styles.input, 'siteAddress', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<Field label="Primary Contact Name" htmlFor="contactName" error={fieldErrors.contactName}>
					<input type="text" id="contactName" name="contactName" className={inputClass(styles.input, 'contactName', fieldErrors)} required onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<FieldRow>
					<Field label="Email" htmlFor="contactEmail" error={fieldErrors.contactEmail}>
						<input type="text" id="contactEmail" name="contactEmail" className={inputClass(styles.input, 'contactEmail', fieldErrors)} required onBlur={handleBlur} onInput={handleInput} />
					</Field>
					<Field label="Phone" htmlFor="contactPhone" error={fieldErrors.contactPhone}>
						<input
							type="tel"
							id="contactPhone"
							name="contactPhone"
							className={inputClass(styles.input, 'contactPhone', fieldErrors)}
							onBlur={handleBlur}
							onInput={handleInput}
							onKeyDown={(e) => {
								// Allow control keys (backspace, tab, arrows, delete, etc.)
								if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;
								// Allow only phone characters: digits 0-9, +, -, (, ), space
								if (!/[\d+\-() ]/.test(e.key)) {
									e.preventDefault();
								}
							}}
						/>
					</Field>
				</FieldRow>
			</Section>

			{/* 2. Electrical Ratings */}
			<Section title="Electrical Ratings" index={2} isOpen={openSections.has(2)} onToggle={() => toggleSection(2)} complete={!!completion[2]}>
				<FieldRow>
					<Field label="HV Rating (kV)" htmlFor="hvRating" error={fieldErrors.hvRating}>
						<input type="number" id="hvRating" name="hvRating" step="0.1" className={inputClass(styles.input, 'hvRating', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
					<Field label="LV Rating (kV)" htmlFor="lvRating" error={fieldErrors.lvRating}>
						<input type="number" id="lvRating" name="lvRating" step="0.1" className={inputClass(styles.input, 'lvRating', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
				</FieldRow>
				<Field label="MVA Rating (continuous)" htmlFor="mvaRating" error={fieldErrors.mvaRating}>
					<input type="number" id="mvaRating" name="mvaRating" step="0.1" className={inputClass(styles.input, 'mvaRating', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<Field label="Frequency">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="frequency" value="60Hz" defaultChecked />
							<span>60 Hz</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="frequency" value="50Hz" />
							<span>50 Hz</span>
						</label>
					</div>
				</Field>
				<Field label="Phase">
					<label className={styles.checkItem}>
						<input type="checkbox" name="phase" value="3-phase" defaultChecked />
						<span>3-phase (standard)</span>
					</label>
				</Field>
				<Field label="Connection / Vector Group">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="vectorGroup" value="Δ-Y" />
							<span>Δ-Y</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="vectorGroup" value="Y-Δ" />
							<span>Y-Δ</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="vectorGroup" value="Y-Y" />
							<span>Y-Y</span>
						</label>
					</div>
				</Field>
				<Field label="Grounding Preference" htmlFor="groundingPreference">
					<input type="text" id="groundingPreference" name="groundingPreference" className={styles.input} />
				</Field>
			</Section>

			{/* 3. Impedance & Performance */}
			<Section title="Impedance & Performance" index={3} isOpen={openSections.has(3)} onToggle={() => toggleSection(3)} complete={!!completion[3]}>
				<FieldRow>
					<Field label="Target Impedance (%Z)" htmlFor="targetImpedance" error={fieldErrors.targetImpedance}>
						<input type="number" id="targetImpedance" name="targetImpedance" step="0.01" className={inputClass(styles.input, 'targetImpedance', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
					<Field label="No-Load Loss (W)" htmlFor="noLoadLoss" error={fieldErrors.noLoadLoss}>
						<input type="number" id="noLoadLoss" name="noLoadLoss" className={inputClass(styles.input, 'noLoadLoss', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
				</FieldRow>
				<Field label="Load Loss Guarantee (W)" htmlFor="loadLoss" error={fieldErrors.loadLoss}>
					<input type="number" id="loadLoss" name="loadLoss" className={inputClass(styles.input, 'loadLoss', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<Field label="Temperature Rise">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="temperatureRise" value="55C" />
							<span>55°C</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="temperatureRise" value="65C" />
							<span>65°C</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="temperatureRise" value="other" />
							<span>Other:</span>
							<input
								type="number"
								name="temperatureRiseOther"
								className={styles.inlineInput}
								placeholder="°C"
								min={0}
								max={999}
								step={1}
								disabled
								onKeyDown={(e) => {
									if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) return;
									if (!/[\d.]/.test(e.key)) e.preventDefault();
								}}
								onBlur={(e) => {
									const n = Number(e.target.value);
									if (e.target.value && (isNaN(n) || n < 0 || n > 999)) {
										e.target.value = String(Math.min(999, Math.max(0, Math.round(n))));
									}
								}}
							/>
						</label>
					</div>
				</Field>
				<Field label="Sound Level Requirement">
					<div className={styles.radioCol}>
						<label className={styles.radioItem}>
							<input type="radio" name="soundLevel" value="standardIEEE" />
							<span>Standard IEEE</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="soundLevel" value="lowNoise" />
							<span>Low-noise</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="soundLevel" value="ultraLowNoise" />
							<span>Ultra-low-noise</span>
						</label>
					</div>
				</Field>
				<Field label="Sound Limit dB(A)" htmlFor="soundLimit" error={fieldErrors.soundLimit}>
					<input type="number" id="soundLimit" name="soundLimit" step="0.1" className={inputClass(styles.input, 'soundLimit', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
			</Section>

			{/* 4. Tap Changer */}
			<Section title="Tap Changer" index={4} isOpen={openSections.has(4)} onToggle={() => toggleSection(4)} complete={!!completion[4]}>
				<Field label="Tap Changer Type">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="tapChangerType" value="DETC" />
							<span>DETC (Off-circuit)</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="tapChangerType" value="OLTC" />
							<span>OLTC (On-load)</span>
						</label>
					</div>
				</Field>
				<FieldRow>
					<Field label="Tap Range (e.g., ±10%)" htmlFor="tapRange">
						<input type="text" id="tapRange" name="tapRange" className={styles.input} />
					</Field>
					<Field label="Tap Steps (e.g., 16, 32)" htmlFor="tapSteps" error={fieldErrors.tapSteps}>
						<input type="text" id="tapSteps" name="tapSteps" className={inputClass(styles.input, 'tapSteps', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
				</FieldRow>
				<Field label="Preferred Tap Location">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="tapLocation" value="HV" />
							<span>HV side</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="tapLocation" value="LV" />
							<span>LV side</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="tapLocation" value="noPreference" />
							<span>No preference</span>
						</label>
					</div>
				</Field>
			</Section>

			{/* 5. Dielectric Requirements */}
			<Section title="Dielectric Requirements" index={5} isOpen={openSections.has(5)} onToggle={() => toggleSection(5)} complete={!!completion[5]}>
				<FieldRow>
					<Field label="HV BIL (kV)" htmlFor="hvBil" error={fieldErrors.hvBil}>
						<input type="number" id="hvBil" name="hvBil" className={inputClass(styles.input, 'hvBil', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
					<Field label="LV BIL (kV)" htmlFor="lvBil" error={fieldErrors.lvBil}>
						<input type="number" id="lvBil" name="lvBil" className={inputClass(styles.input, 'lvBil', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
				</FieldRow>
				<Field label="Surge / Lightning Requirements">
					<div className={styles.radioCol}>
						<label className={styles.radioItem}>
							<input type="radio" name="surgeRequirements" value="standard" />
							<span>Standard</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="surgeRequirements" value="enhanced" />
							<span>Enhanced</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="surgeRequirements" value="provideSurgeProfile" />
							<span>Provide surge profile (optional upload)</span>
						</label>
					</div>
				</Field>
			</Section>

			{/* 6. Mechanical & Transport Limits */}
			<Section title="Mechanical & Transport" index={6} isOpen={openSections.has(6)} onToggle={() => toggleSection(6)} complete={!!completion[6]}>
				<Field label="Max Shipping Weight (metric tons)" htmlFor="maxShippingWeight" error={fieldErrors.maxShippingWeight}>
					<input type="number" id="maxShippingWeight" name="maxShippingWeight" step="0.1" min="0" className={inputClass(styles.input, 'maxShippingWeight', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<FieldRow>
					<Field label="Max Height (m)" htmlFor="maxHeight" error={fieldErrors.maxHeight}>
						<input type="number" id="maxHeight" name="maxHeight" step="0.1" min="0" className={inputClass(styles.input, 'maxHeight', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
					<Field label="Max Width (m)" htmlFor="maxWidth" error={fieldErrors.maxWidth}>
						<input type="number" id="maxWidth" name="maxWidth" step="0.1" min="0" className={inputClass(styles.input, 'maxWidth', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
				</FieldRow>
				<Field label="Max Length (m)" htmlFor="maxLength" error={fieldErrors.maxLength}>
					<input type="number" id="maxLength" name="maxLength" step="0.1" min="0" className={inputClass(styles.input, 'maxLength', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<Field label="Seismic Rating">
					<div className={styles.radioCol}>
						<label className={styles.radioItem}>
							<input type="radio" name="seismicRating" value="zone2" />
							<span>Zone 2</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="seismicRating" value="zone3" />
							<span>Zone 3</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="seismicRating" value="zone4" />
							<span>Zone 4</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="seismicRating" value="provideSiteSpec" />
							<span>Provide site spec (upload)</span>
						</label>
					</div>
				</Field>
				<Field label="Site Footprint Constraints" htmlFor="siteFootprint">
					<textarea id="siteFootprint" name="siteFootprint" rows={2} className={styles.textarea} />
				</Field>
			</Section>

			{/* 7. Cooling & Fluid System */}
			<Section title="Cooling & Fluid System" index={7} isOpen={openSections.has(7)} onToggle={() => toggleSection(7)} complete={!!completion[7]}>
				<Field label="Cooling Class">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="coolingClass" value="ONAN" />
							<span>ONAN</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="coolingClass" value="ONAF" />
							<span>ONAF</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="coolingClass" value="OFAF" />
							<span>OFAF</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="coolingClass" value="ODAF" />
							<span>ODAF</span>
						</label>
					</div>
				</Field>
				<Field label="Cooling Redundancy">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="coolingRedundancy" value="N+1" />
							<span>N+1</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="coolingRedundancy" value="N+2" />
							<span>N+2</span>
						</label>
					</div>
				</Field>
				<Field label="Oil Type">
					<div className={styles.radioCol}>
						<label className={styles.radioItem}>
							<input type="radio" name="oilType" value="mineralOil" />
							<span>Mineral oil</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="oilType" value="naturalEster" />
							<span>Natural ester</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="oilType" value="syntheticEster" />
							<span>Synthetic ester</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="oilType" value="other" />
							<span>Other:</span>
							<input
								type="text"
								name="oilTypeOther"
								className={styles.inlineInput}
								placeholder="Specify"
								disabled
							/>
						</label>
					</div>
				</Field>
			</Section>

			{/* 8. Environmental & Special Requirements */}
			<Section title="Environmental & Special" index={8} isOpen={openSections.has(8)} onToggle={() => toggleSection(8)} complete={!!completion[8]}>
				<Field label="Corrosion / Paint Class">
					<div className={styles.radioCol}>
						<label className={styles.radioItem}>
							<input type="radio" name="corrosionClass" value="standardInland" />
							<span>Standard inland</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="corrosionClass" value="heavyIndustrial" />
							<span>Heavy industrial</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="corrosionClass" value="coastalSaltFog" />
							<span>Coastal / Salt fog</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="corrosionClass" value="custom" />
							<span>Custom:</span>
							<input
								type="text"
								name="corrosionClassCustom"
								className={styles.inlineInput}
								placeholder="Specify"
								disabled
							/>
						</label>
					</div>
				</Field>
				<Field label="Noise Barriers Required?">
					<div className={styles.radioRow}>
						<label className={styles.radioItem}>
							<input type="radio" name="noiseBarriers" value="yes" />
							<span>Yes</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="noiseBarriers" value="no" />
							<span>No</span>
						</label>
					</div>
				</Field>
				<Field label="Altitude Above Sea Level (m)" htmlFor="altitude" error={fieldErrors.altitude}>
					<input type="number" id="altitude" name="altitude" step="1" min="0" className={inputClass(styles.input, 'altitude', fieldErrors)} placeholder="If >1000m derating applies" onBlur={handleBlur} onInput={handleInput} />
				</Field>
				<FieldRow>
					<Field label="Max Ambient Temp (°C)" htmlFor="maxAmbient" error={fieldErrors.maxAmbient}>
						<input type="number" id="maxAmbient" name="maxAmbient" className={inputClass(styles.input, 'maxAmbient', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
					<Field label="Min Ambient Temp (°C)" htmlFor="minAmbient" error={fieldErrors.minAmbient}>
						<input type="number" id="minAmbient" name="minAmbient" className={inputClass(styles.input, 'minAmbient', fieldErrors)} onBlur={handleBlur} onInput={handleInput} />
					</Field>
				</FieldRow>
			</Section>

			{/* 9. Testing Requirements */}
			<Section title="Testing Requirements" index={9} isOpen={openSections.has(9)} onToggle={() => toggleSection(9)} complete={!!completion[9]}>
				<div className={styles.checkGrid}>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="standardRoutine" />
						<span>Standard routine tests</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="temperatureRise" />
						<span>Temperature-rise test</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="lightningImpulse" />
						<span>Lightning impulse test</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="switchingSurge" />
						<span>Switching surge test</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="FRA" />
						<span>FRA (Freq. Response)</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="specialWitness" />
						<span>Special witness testing</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="extendedHeatRun" />
						<span>Extended heat run</span>
					</label>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="zeroSequence" />
						<span>Zero-sequence impedance</span>
					</label>
				</div>

				<Field label="" error={fieldErrors.partialDischargeLimit}>
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="partialDischarge" />
						<span>Partial Discharge limit</span>
					</label>
					<input
						type="number"
						name="partialDischargeLimit"
						className={`${inputClass(styles.input, 'partialDischargeLimit', fieldErrors)} ${styles.stackTight}`}
						placeholder="Specify pC limit"
						onBlur={handleBlur}
						onInput={handleInput}
					/>
				</Field>

				<Field label="Optional Uploads">
					<div className={styles.radioCol}>
						<label className={styles.checkItem}>
							<input type="checkbox" name="optionalUploads" value="utilitySpec" />
							<span>Utility standard spec document</span>
						</label>
						<label className={styles.checkItem}>
							<input type="checkbox" name="optionalUploads" value="testProcedures" />
							<span>Special test procedures</span>
						</label>
					</div>
				</Field>
			</Section>

			{/* 10. Compliance */}
			<Section title="Compliance" index={10} isOpen={openSections.has(10)} onToggle={() => toggleSection(10)} complete={!!completion[10]}>
				<Field label="Governing Standards">
					<div className={styles.radioCol}>
						<label className={styles.radioItem}>
							<input type="radio" name="governingStandards" value="IEEEC57" />
							<span>IEEE C57 (North America)</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="governingStandards" value="IEC" />
							<span>IEC</span>
						</label>
						<label className={styles.radioItem}>
							<input type="radio" name="governingStandards" value="utilitySpecific" />
							<span>Utility-specific standard (upload)</span>
						</label>
					</div>
				</Field>
			</Section>

			{/* 11. Additional Notes */}
			<Section title="Additional Notes" index={11} isOpen={openSections.has(11)} onToggle={() => toggleSection(11)} complete={!!completion[11]}>
				<Field label="" htmlFor="additionalNotes">
					<textarea
						id="additionalNotes"
						name="additionalNotes"
						rows={4}
						className={styles.textarea}
						placeholder="Enter any additional requirements or notes..."
					/>
				</Field>
			</Section>

			{/* Submit */}
			<div className={styles.submitArea}>
				<div className={styles.submitWrapper}>
					<button
						type="submit"
						className={styles.submitBtn}
						disabled={!allComplete || submitting || hasValidationErrors}
					>
						{submitting ? 'Submitting...' : 'Submit Advance Purchase Indication'}
					</button>
					{(!allComplete || hasValidationErrors) && !submitting && (
						<span className={styles.submitTooltip}>
							{hasValidationErrors
								? 'Please fix the validation errors above before submitting.'
								: 'Please complete all fields above before submitting your order!'}
						</span>
					)}
				</div>
				{submitError && (
					<p className={styles.submitError}>Submission failed: {submitError}</p>
				)}
			</div>

			{/* Success Modal */}
			<SuccessModal
				isOpen={showSuccess}
				onClose={() => setShowSuccess(false)}
				title="Thank You"
				message="Your Advance Purchase Indication has been submitted successfully."
				subMessage="Someone from our team will contact you soon."
			/>

			{/* Autofill Button (fixed, top-right below theme toggle) */}
			{SHOW_AUTOFILL && (
				<button
					type="button"
					onClick={handleDebugFill}
					className={styles.autofillBtn}
				>
					Autofill Form
				</button>
			)}

			{/* Debug Button */}
			{!HIDE_DEBUG && (
				<button
					type="button"
					onClick={handleDebugFill}
					className={styles.debugButton}
				>
					Debug: Auto-fill
				</button>
			)}
		</form>
	);
}
