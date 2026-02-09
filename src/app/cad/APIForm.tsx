'use client';

import { useEffect, useCallback } from 'react';
import { FormFieldset, FormGroup, FormRow, SubmitButton } from '@/components';
import styles from './APIForm.module.css';

export function APIForm() {
  // Handle "Other" text inputs - enable only when "Other" radio is selected
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

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, string | string[]> = {};

    // Handle regular fields
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

    data.submittedAt = new Date().toISOString();

    // Print JSON to console
    console.log(JSON.stringify(data, null, 2));
  }, []);

  return (
    <form id="nbpoForm" onSubmit={handleSubmit}>
      {/* 1. Basic Information */}
      <FormFieldset legend="1. Basic Information">
        <FormGroup label="Company Name" htmlFor="companyName">
          <input type="text" id="companyName" name="companyName" required />
        </FormGroup>

        <FormGroup label="Project / Site Name" htmlFor="projectName">
          <input type="text" id="projectName" name="projectName" />
        </FormGroup>

        <FormGroup label="Site Address or GPS Coordinates" htmlFor="siteAddress">
          <input type="text" id="siteAddress" name="siteAddress" />
        </FormGroup>

        <FormRow>
          <FormGroup label="Primary Contact Name" htmlFor="contactName">
            <input type="text" id="contactName" name="contactName" required />
          </FormGroup>
          <FormGroup label="Email" htmlFor="contactEmail">
            <input type="email" id="contactEmail" name="contactEmail" required />
          </FormGroup>
          <FormGroup label="Phone" htmlFor="contactPhone">
            <input type="tel" id="contactPhone" name="contactPhone" />
          </FormGroup>
        </FormRow>
      </FormFieldset>

      {/* 2. Electrical Ratings */}
      <FormFieldset legend="2. Electrical Ratings">
        <FormRow>
          <FormGroup label="High-Voltage Rating (kV)" htmlFor="hvRating">
            <input type="number" id="hvRating" name="hvRating" step="0.1" />
          </FormGroup>
          <FormGroup label="Low-Voltage Rating (kV)" htmlFor="lvRating">
            <input type="number" id="lvRating" name="lvRating" step="0.1" />
          </FormGroup>
          <FormGroup label="MVA Rating (continuous)" htmlFor="mvaRating">
            <input type="number" id="mvaRating" name="mvaRating" step="0.1" />
          </FormGroup>
        </FormRow>

        <FormGroup label="Frequency">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="frequency" value="60Hz" defaultChecked />
              60 Hz
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="frequency" value="50Hz" />
              50 Hz
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Phase">
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="phase" value="3-phase" defaultChecked />
              3-phase (standard)
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Connection / Vector Group">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="vectorGroup" value="Δ-Y" />
              Δ-Y
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="vectorGroup" value="Y-Δ" />
              Y-Δ
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="vectorGroup" value="Y-Y" />
              Y-Y
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Grounding Preference" htmlFor="groundingPreference">
          <input type="text" id="groundingPreference" name="groundingPreference" />
        </FormGroup>
      </FormFieldset>

      {/* 3. Impedance & Performance */}
      <FormFieldset legend="3. Impedance & Performance">
        <FormRow>
          <FormGroup label="Target Impedance (%Z)" htmlFor="targetImpedance">
            <input type="number" id="targetImpedance" name="targetImpedance" step="0.01" />
          </FormGroup>
          <FormGroup label="No-Load Loss Guarantee (W)" htmlFor="noLoadLoss">
            <input type="number" id="noLoadLoss" name="noLoadLoss" />
          </FormGroup>
          <FormGroup label="Load Loss Guarantee (W)" htmlFor="loadLoss">
            <input type="number" id="loadLoss" name="loadLoss" />
          </FormGroup>
        </FormRow>

        <FormGroup label="Temperature Rise">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="temperatureRise" value="55C" />
              55°C
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="temperatureRise" value="65C" />
              65°C
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="temperatureRise" value="other" />
              Other:
              <input
                type="text"
                name="temperatureRiseOther"
                className={styles.inlineInput}
                placeholder="Specify"
                disabled
              />
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Sound Level Requirement">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="soundLevel" value="standardIEEE" />
              Standard IEEE
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="soundLevel" value="lowNoise" />
              Low-noise
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="soundLevel" value="ultraLowNoise" />
              Ultra-low-noise
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Sound Limit (if specified) dB(A)" htmlFor="soundLimit">
          <input type="number" id="soundLimit" name="soundLimit" step="0.1" />
        </FormGroup>
      </FormFieldset>

      {/* 4. Tap Changer */}
      <FormFieldset legend="4. Tap Changer">
        <FormGroup label="Tap Changer Type">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="tapChangerType" value="DETC" />
              DETC (Off-circuit)
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="tapChangerType" value="OLTC" />
              OLTC (On-load tap changer)
            </label>
          </div>
        </FormGroup>

        <FormRow>
          <FormGroup label="Tap Range (e.g., ±10%)" htmlFor="tapRange">
            <input type="text" id="tapRange" name="tapRange" />
          </FormGroup>
          <FormGroup label="Tap Steps (e.g., 16, 32)" htmlFor="tapSteps">
            <input type="text" id="tapSteps" name="tapSteps" />
          </FormGroup>
        </FormRow>

        <FormGroup label="Preferred Tap Location">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="tapLocation" value="HV" />
              HV side
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="tapLocation" value="LV" />
              LV side
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="tapLocation" value="noPreference" />
              No preference
            </label>
          </div>
        </FormGroup>
      </FormFieldset>

      {/* 5. Dielectric Requirements */}
      <FormFieldset legend="5. Dielectric Requirements">
        <FormRow>
          <FormGroup label="HV BIL (kV)" htmlFor="hvBil">
            <input type="number" id="hvBil" name="hvBil" />
          </FormGroup>
          <FormGroup label="LV BIL (kV)" htmlFor="lvBil">
            <input type="number" id="lvBil" name="lvBil" />
          </FormGroup>
        </FormRow>

        <FormGroup label="Surge / Lightning Requirements">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="surgeRequirements" value="standard" />
              Standard
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="surgeRequirements" value="enhanced" />
              Enhanced
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="surgeRequirements" value="provideSurgeProfile" />
              Provide surge profile (optional upload)
            </label>
          </div>
        </FormGroup>
      </FormFieldset>

      {/* 6. Mechanical & Transport Limits */}
      <FormFieldset legend="6. Mechanical & Transport Limits">
        <FormGroup label="Max Shipping Weight (lbs or metric tons)" htmlFor="maxShippingWeight">
          <input type="text" id="maxShippingWeight" name="maxShippingWeight" />
        </FormGroup>

        <FormRow>
          <FormGroup label="Max Height" htmlFor="maxHeight">
            <input type="text" id="maxHeight" name="maxHeight" />
          </FormGroup>
          <FormGroup label="Max Width" htmlFor="maxWidth">
            <input type="text" id="maxWidth" name="maxWidth" />
          </FormGroup>
          <FormGroup label="Max Length" htmlFor="maxLength">
            <input type="text" id="maxLength" name="maxLength" />
          </FormGroup>
        </FormRow>

        <FormGroup label="Seismic Rating">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="seismicRating" value="zone2" />
              Seismic Zone 2
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="seismicRating" value="zone3" />
              Seismic Zone 3
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="seismicRating" value="zone4" />
              Seismic Zone 4
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="seismicRating" value="provideSiteSpec" />
              Provide site seismic spec (optional upload)
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Site Footprint Constraints (Max pad area, orientation, obstacles)" htmlFor="siteFootprint">
          <textarea id="siteFootprint" name="siteFootprint" rows={3} />
        </FormGroup>
      </FormFieldset>

      {/* 7. Cooling & Fluid System */}
      <FormFieldset legend="7. Cooling & Fluid System">
        <FormGroup label="Cooling Class">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="coolingClass" value="ONAN" />
              ONAN
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="coolingClass" value="ONAF" />
              ONAF
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="coolingClass" value="OFAF" />
              OFAF
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="coolingClass" value="ODAF" />
              ODAF
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Cooling Redundancy">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="coolingRedundancy" value="N+1" />
              N+1
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="coolingRedundancy" value="N+2" />
              N+2
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Oil Type">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="oilType" value="mineralOil" />
              Mineral oil
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="oilType" value="naturalEster" />
              Natural ester
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="oilType" value="syntheticEster" />
              Synthetic ester
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="oilType" value="other" />
              Other:
              <input
                type="text"
                name="oilTypeOther"
                className={styles.inlineInput}
                placeholder="Specify"
                disabled
              />
            </label>
          </div>
        </FormGroup>
      </FormFieldset>

      {/* 8. Environmental & Special Requirements */}
      <FormFieldset legend="8. Environmental & Special Requirements">
        <FormGroup label="Corrosion / Paint Class">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="corrosionClass" value="standardInland" />
              Standard inland
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="corrosionClass" value="heavyIndustrial" />
              Heavy industrial
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="corrosionClass" value="coastalSaltFog" />
              Coastal / Salt fog
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="corrosionClass" value="custom" />
              Custom:
              <input
                type="text"
                name="corrosionClassCustom"
                className={styles.inlineInput}
                placeholder="Specify"
                disabled
              />
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Noise Barriers Required?">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="noiseBarriers" value="yes" />
              Yes
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="noiseBarriers" value="no" />
              No
            </label>
          </div>
        </FormGroup>

        <FormGroup label="Altitude Above Sea Level (ft or m)" htmlFor="altitude">
          <input type="text" id="altitude" name="altitude" placeholder="If >1000m derating applies" />
        </FormGroup>

        <FormRow>
          <FormGroup label="Max Ambient Temperature (°C)" htmlFor="maxAmbient">
            <input type="number" id="maxAmbient" name="maxAmbient" />
          </FormGroup>
          <FormGroup label="Min Ambient Temperature (°C)" htmlFor="minAmbient">
            <input type="number" id="minAmbient" name="minAmbient" />
          </FormGroup>
        </FormRow>
      </FormFieldset>

      {/* 9. Testing Requirements */}
      <FormFieldset legend="9. Testing Requirements" note="Select all that apply">
        <div className={styles.checkboxGrid}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="standardRoutine" />
            Standard IEEE/IEC routine tests
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="temperatureRise" />
            Temperature-rise test
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="lightningImpulse" />
            Lightning impulse test
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="switchingSurge" />
            Switching surge test
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="FRA" />
            FRA (Frequency Response Analysis)
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="specialWitness" />
            Special witness testing required
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="extendedHeatRun" />
            Extended heat run
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="zeroSequence" />
            Zero-sequence impedance
          </label>
        </div>

        <FormGroup label="">
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="testing" value="partialDischarge" />
            Partial Discharge limit
          </label>
          <input
            type="number"
            name="partialDischargeLimit"
            className={styles.inlineInputWide}
            placeholder="Specify pC limit"
          />
        </FormGroup>

        <FormGroup label="Optional Uploads (indicate if you will provide)">
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="optionalUploads" value="utilitySpec" />
              Utility standard specification document
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="optionalUploads" value="testProcedures" />
              Special test procedures
            </label>
          </div>
        </FormGroup>
      </FormFieldset>

      {/* 10. Compliance */}
      <FormFieldset legend="10. Compliance">
        <FormGroup label="Governing Standards">
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="governingStandards" value="IEEEC57" />
              IEEE C57 (North America)
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="governingStandards" value="IEC" />
              IEC
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="governingStandards" value="utilitySpecific" />
              Utility-specific standard (upload)
            </label>
          </div>
        </FormGroup>
      </FormFieldset>

      {/* 11. Additional Notes */}
      <FormFieldset legend="11. Additional Notes / Requirements">
        <FormGroup label="" htmlFor="additionalNotes">
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={5}
            placeholder="Enter any additional requirements or notes..."
          />
        </FormGroup>
      </FormFieldset>

      {/* Section III: Commercial Conditions */}
      <section className="text-section-inner">
        <h2 className="section-title">III. Commercial Conditions</h2>
        <p className="small-text">
          This Advance Purchase Indication (&quot;API&quot;) is submitted solely for the purpose
          of enabling Terminus Industrials to evaluate demand, prepare preliminary commercial
          terms, and issue a subsequent Non-Binding Purchase Order (&quot;NBPO&quot;) for the
          Requestor&apos;s review. The API does not constitute an order, agreement, offer,
          acceptance, or commitment by either party. No party shall incur any liability,
          obligation, or financial responsibility of any kind as a result of submitting,
          reviewing, or relying upon this API. The Requestor shall not be obligated to
          purchase any product, and Terminus Industrials shall not be obligated to
          manufacture, reserve capacity, or provide any goods or services unless and until
          a separate definitive agreement is executed by both parties. Both parties expressly
          disclaim any damages, reliance claims, expectations of performance, or remedies
          arising from this API, and each retains the unrestricted right to modify or withdraw
          from the process at any time prior to signing a binding agreement.
        </p>
      </section>

      {/* Submit Button */}
      <div className="form-submit">
        <SubmitButton>Submit</SubmitButton>
      </div>
    </form>
  );
}
