'use client';

import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import styles from './APIForm.module.css';
import { submitAPIForm } from '@/actions/email';
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
	maxShippingWeight: '180 metric tons',
	maxHeight: '4.5m',
	maxWidth: '4.0m',
	maxLength: '8.0m',
	seismicRating: 'zone4',
	siteFootprint: 'Max pad area 15m x 20m. No overhead obstructions. East-west orientation preferred.',
	coolingClass: 'ONAF',
	coolingRedundancy: 'N+1',
	oilType: 'naturalEster',
	corrosionClass: 'heavyIndustrial',
	noiseBarriers: 'no',
	altitude: '350m',
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

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
	return (
		<div className={styles.field}>
			{label && <label className={styles.fieldLabel} htmlFor={htmlFor}>{label}</label>}
			{children}
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

/* ─── Main Form ─── */

export function APIForm() {
	const [openSections, setOpenSections] = useState<Set<number>>(new Set([1]));
	const [completion, setCompletion] = useState<Record<number, boolean>>({});
	const formRef = useRef<HTMLFormElement>(null);

	const allComplete = useMemo(
		() => Object.keys(SECTION_FIELDS).every((k) => completion[Number(k)]),
		[completion],
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
	const [submitResult, setSubmitResult] = useState<{ success: boolean; error?: string } | null>(null);

	const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitting(true);
		setSubmitResult(null);

		const form = e.currentTarget;
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
			setSubmitResult(result);
			if (result.success) {
				console.warn('[API Submission] Emails sent successfully.');
			} else {
				console.error('[API Submission] Email failed:', result.error);
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Unknown error';
			console.error('[API Submission] Error:', msg);
			setSubmitResult({ success: false, error: msg });
		} finally {
			setSubmitting(false);
		}
	}, []);

	return (
		<form id="nbpoForm" ref={formRef} onSubmit={handleSubmit} className={styles.cadForm}>
			{/* 1. Basic Information */}
			<Section title="Basic Information" index={1} isOpen={openSections.has(1)} onToggle={() => toggleSection(1)} complete={!!completion[1]}>
				<Field label="Company Name" htmlFor="companyName">
					<input type="text" id="companyName" name="companyName" className={styles.input} required />
				</Field>
				<Field label="Project / Site Name" htmlFor="projectName">
					<input type="text" id="projectName" name="projectName" className={styles.input} />
				</Field>
				<Field label="Site Address or GPS Coordinates" htmlFor="siteAddress">
					<input type="text" id="siteAddress" name="siteAddress" className={styles.input} />
				</Field>
				<Field label="Primary Contact Name" htmlFor="contactName">
					<input type="text" id="contactName" name="contactName" className={styles.input} required />
				</Field>
				<FieldRow>
					<Field label="Email" htmlFor="contactEmail">
						<input type="email" id="contactEmail" name="contactEmail" className={styles.input} required />
					</Field>
					<Field label="Phone" htmlFor="contactPhone">
						<input type="tel" id="contactPhone" name="contactPhone" className={styles.input} />
					</Field>
				</FieldRow>
			</Section>

			{/* 2. Electrical Ratings */}
			<Section title="Electrical Ratings" index={2} isOpen={openSections.has(2)} onToggle={() => toggleSection(2)} complete={!!completion[2]}>
				<FieldRow>
					<Field label="HV Rating (kV)" htmlFor="hvRating">
						<input type="number" id="hvRating" name="hvRating" step="0.1" className={styles.input} />
					</Field>
					<Field label="LV Rating (kV)" htmlFor="lvRating">
						<input type="number" id="lvRating" name="lvRating" step="0.1" className={styles.input} />
					</Field>
				</FieldRow>
				<Field label="MVA Rating (continuous)" htmlFor="mvaRating">
					<input type="number" id="mvaRating" name="mvaRating" step="0.1" className={styles.input} />
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
					<Field label="Target Impedance (%Z)" htmlFor="targetImpedance">
						<input type="number" id="targetImpedance" name="targetImpedance" step="0.01" className={styles.input} />
					</Field>
					<Field label="No-Load Loss (W)" htmlFor="noLoadLoss">
						<input type="number" id="noLoadLoss" name="noLoadLoss" className={styles.input} />
					</Field>
				</FieldRow>
				<Field label="Load Loss Guarantee (W)" htmlFor="loadLoss">
					<input type="number" id="loadLoss" name="loadLoss" className={styles.input} />
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
								type="text"
								name="temperatureRiseOther"
								className={styles.inlineInput}
								placeholder="Specify"
								disabled
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
				<Field label="Sound Limit dB(A)" htmlFor="soundLimit">
					<input type="number" id="soundLimit" name="soundLimit" step="0.1" className={styles.input} />
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
					<Field label="Tap Steps (e.g., 16, 32)" htmlFor="tapSteps">
						<input type="text" id="tapSteps" name="tapSteps" className={styles.input} />
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
					<Field label="HV BIL (kV)" htmlFor="hvBil">
						<input type="number" id="hvBil" name="hvBil" className={styles.input} />
					</Field>
					<Field label="LV BIL (kV)" htmlFor="lvBil">
						<input type="number" id="lvBil" name="lvBil" className={styles.input} />
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
				<Field label="Max Shipping Weight (lbs or metric tons)" htmlFor="maxShippingWeight">
					<input type="text" id="maxShippingWeight" name="maxShippingWeight" className={styles.input} />
				</Field>
				<FieldRow>
					<Field label="Max Height" htmlFor="maxHeight">
						<input type="text" id="maxHeight" name="maxHeight" className={styles.input} />
					</Field>
					<Field label="Max Width" htmlFor="maxWidth">
						<input type="text" id="maxWidth" name="maxWidth" className={styles.input} />
					</Field>
				</FieldRow>
				<Field label="Max Length" htmlFor="maxLength">
					<input type="text" id="maxLength" name="maxLength" className={styles.input} />
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
				<Field label="Altitude Above Sea Level" htmlFor="altitude">
					<input type="text" id="altitude" name="altitude" className={styles.input} placeholder="If >1000m derating applies" />
				</Field>
				<FieldRow>
					<Field label="Max Ambient Temp (°C)" htmlFor="maxAmbient">
						<input type="number" id="maxAmbient" name="maxAmbient" className={styles.input} />
					</Field>
					<Field label="Min Ambient Temp (°C)" htmlFor="minAmbient">
						<input type="number" id="minAmbient" name="minAmbient" className={styles.input} />
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

				<Field label="">
					<label className={styles.checkItem}>
						<input type="checkbox" name="testing" value="partialDischarge" />
						<span>Partial Discharge limit</span>
					</label>
					<input
						type="number"
						name="partialDischargeLimit"
						className={`${styles.input} ${styles.stackTight}`}
						placeholder="Specify pC limit"
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
						disabled={!allComplete || submitting}
					>
						{submitting ? 'Submitting...' : 'Submit Advance Purchase Indication'}
					</button>
					{!allComplete && !submitting && (
						<span className={styles.submitTooltip}>
							Please complete all fields above before submitting your order!
						</span>
					)}
				</div>
				{submitResult && (
					<p className={submitResult.success ? styles.submitSuccess : styles.submitError}>
						{submitResult.success
							? 'Your Advance Purchase Indication has been submitted successfully.'
							: `Submission failed: ${submitResult.error ?? 'Unknown error'}`}
					</p>
				)}
			</div>

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
