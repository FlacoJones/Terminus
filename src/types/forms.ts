// Contact form data
export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
}

// API (Advance Purchase Indication) form data
export interface APIFormData {
  // Basic Information
  companyName: string;
  projectName?: string;
  siteAddress?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;

  // Electrical Ratings
  hvRating?: number;
  lvRating?: number;
  mvaRating?: number;
  frequency: '60Hz' | '50Hz';
  phase?: string[];
  vectorGroup?: 'Δ-Y' | 'Y-Δ' | 'Y-Y';
  groundingPreference?: string;

  // Impedance & Performance
  targetImpedance?: number;
  noLoadLoss?: number;
  loadLoss?: number;
  temperatureRise?: '55C' | '65C' | 'other';
  temperatureRiseOther?: string;
  soundLevel?: 'standardIEEE' | 'lowNoise' | 'ultraLowNoise';
  soundLimit?: number;

  // Tap Changer
  tapChangerType?: 'DETC' | 'OLTC';
  tapRange?: string;
  tapSteps?: string;
  tapLocation?: 'HV' | 'LV' | 'noPreference';

  // Dielectric Requirements
  hvBil?: number;
  lvBil?: number;
  surgeRequirements?: 'standard' | 'enhanced' | 'provideSurgeProfile';

  // Mechanical & Transport Limits
  maxShippingWeight?: string;
  maxHeight?: string;
  maxWidth?: string;
  maxLength?: string;
  seismicRating?: 'zone2' | 'zone3' | 'zone4' | 'provideSiteSpec';
  siteFootprint?: string;

  // Cooling & Fluid System
  coolingClass?: 'ONAN' | 'ONAF' | 'OFAF' | 'ODAF';
  coolingRedundancy?: 'N+1' | 'N+2';
  oilType?: 'mineralOil' | 'naturalEster' | 'syntheticEster' | 'other';
  oilTypeOther?: string;

  // Environmental & Special Requirements
  corrosionClass?: 'standardInland' | 'heavyIndustrial' | 'coastalSaltFog' | 'custom';
  corrosionClassCustom?: string;
  noiseBarriers?: 'yes' | 'no';
  altitude?: string;
  maxAmbient?: number;
  minAmbient?: number;

  // Testing Requirements
  testing?: string[];
  partialDischargeLimit?: number;
  optionalUploads?: string[];

  // Compliance
  governingStandards?: 'IEEEC57' | 'IEC' | 'utilitySpecific';

  // Additional Notes
  additionalNotes?: string;
}

// Stored submission with metadata
export interface APISubmission extends APIFormData {
  id: string;
  savedAt: string;
  submittedAt?: string;
}

// Email request payload
export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

// Field labels for display
export const FIELD_LABELS: Record<string, string> = {
  companyName: 'Company Name',
  projectName: 'Project / Site Name',
  siteAddress: 'Site Address / GPS Coordinates',
  contactName: 'Primary Contact Name',
  contactEmail: 'Email',
  contactPhone: 'Phone',
  hvRating: 'High-Voltage Rating (kV)',
  lvRating: 'Low-Voltage Rating (kV)',
  mvaRating: 'MVA Rating (continuous)',
  frequency: 'Frequency',
  phase: 'Phase',
  vectorGroup: 'Connection / Vector Group',
  groundingPreference: 'Grounding Preference',
  targetImpedance: 'Target Impedance (%Z)',
  noLoadLoss: 'No-Load Loss Guarantee (W)',
  loadLoss: 'Load Loss Guarantee (W)',
  temperatureRise: 'Temperature Rise',
  temperatureRiseOther: 'Temperature Rise (Other)',
  soundLevel: 'Sound Level Requirement',
  soundLimit: 'Sound Limit (dB(A))',
  tapChangerType: 'Tap Changer Type',
  tapRange: 'Tap Range',
  tapSteps: 'Tap Steps',
  tapLocation: 'Preferred Tap Location',
  hvBil: 'HV BIL (kV)',
  lvBil: 'LV BIL (kV)',
  surgeRequirements: 'Surge / Lightning Requirements',
  maxShippingWeight: 'Max Shipping Weight',
  maxHeight: 'Max Height',
  maxWidth: 'Max Width',
  maxLength: 'Max Length',
  seismicRating: 'Seismic Rating',
  siteFootprint: 'Site Footprint Constraints',
  coolingClass: 'Cooling Class',
  coolingRedundancy: 'Cooling Redundancy',
  oilType: 'Oil Type',
  oilTypeOther: 'Oil Type (Other)',
  corrosionClass: 'Corrosion / Paint Class',
  corrosionClassCustom: 'Corrosion Class (Custom)',
  noiseBarriers: 'Noise Barriers Required',
  altitude: 'Altitude Above Sea Level',
  maxAmbient: 'Max Ambient Temperature (°C)',
  minAmbient: 'Min Ambient Temperature (°C)',
  testing: 'Testing Requirements',
  partialDischargeLimit: 'Partial Discharge Limit (pC)',
  optionalUploads: 'Optional Uploads',
  governingStandards: 'Governing Standards',
  additionalNotes: 'Additional Notes',
};

// Value display formatters
export const VALUE_FORMAT_MAP: Record<string, string> = {
  '60Hz': '60 Hz',
  '50Hz': '50 Hz',
  '3-phase': '3-Phase (Standard)',
  'Δ-Y': 'Δ-Y',
  'Y-Δ': 'Y-Δ',
  'Y-Y': 'Y-Y',
  '55C': '55°C',
  '65C': '65°C',
  standardIEEE: 'Standard IEEE',
  lowNoise: 'Low-noise',
  ultraLowNoise: 'Ultra-low-noise',
  DETC: 'DETC (Off-circuit)',
  OLTC: 'OLTC (On-load)',
  HV: 'HV Side',
  LV: 'LV Side',
  noPreference: 'No Preference',
  standard: 'Standard',
  enhanced: 'Enhanced',
  provideSurgeProfile: 'Will Provide Surge Profile',
  zone2: 'Seismic Zone 2',
  zone3: 'Seismic Zone 3',
  zone4: 'Seismic Zone 4',
  provideSiteSpec: 'Will Provide Site Seismic Spec',
  ONAN: 'ONAN',
  ONAF: 'ONAF',
  OFAF: 'OFAF',
  ODAF: 'ODAF',
  'N+1': 'N+1',
  'N+2': 'N+2',
  mineralOil: 'Mineral Oil',
  naturalEster: 'Natural Ester',
  syntheticEster: 'Synthetic Ester',
  standardInland: 'Standard Inland',
  heavyIndustrial: 'Heavy Industrial',
  coastalSaltFog: 'Coastal / Salt Fog',
  yes: 'Yes',
  no: 'No',
  standardRoutine: 'Standard IEEE/IEC Routine Tests',
  temperatureRise: 'Temperature-rise Test',
  lightningImpulse: 'Lightning Impulse Test',
  switchingSurge: 'Switching Surge Test',
  FRA: 'FRA (Frequency Response Analysis)',
  specialWitness: 'Special Witness Testing',
  extendedHeatRun: 'Extended Heat Run',
  zeroSequence: 'Zero-sequence Impedance',
  partialDischarge: 'Partial Discharge Test',
  utilitySpec: 'Utility Standard Specification',
  testProcedures: 'Special Test Procedures',
  IEEEC57: 'IEEE C57 (North America)',
  IEC: 'IEC',
  utilitySpecific: 'Utility-specific Standard',
};

// Review sections groupings
export const REVIEW_SECTIONS = [
  {
    title: '1. Basic Information',
    fields: ['companyName', 'projectName', 'siteAddress', 'contactName', 'contactEmail', 'contactPhone'],
  },
  {
    title: '2. Electrical Ratings',
    fields: ['hvRating', 'lvRating', 'mvaRating', 'frequency', 'phase', 'vectorGroup', 'groundingPreference'],
  },
  {
    title: '3. Impedance & Performance',
    fields: ['targetImpedance', 'noLoadLoss', 'loadLoss', 'temperatureRise', 'temperatureRiseOther', 'soundLevel', 'soundLimit'],
  },
  {
    title: '4. Tap Changer',
    fields: ['tapChangerType', 'tapRange', 'tapSteps', 'tapLocation'],
  },
  {
    title: '5. Dielectric Requirements',
    fields: ['hvBil', 'lvBil', 'surgeRequirements'],
  },
  {
    title: '6. Mechanical & Transport Limits',
    fields: ['maxShippingWeight', 'maxHeight', 'maxWidth', 'maxLength', 'seismicRating', 'siteFootprint'],
  },
  {
    title: '7. Cooling & Fluid System',
    fields: ['coolingClass', 'coolingRedundancy', 'oilType', 'oilTypeOther'],
  },
  {
    title: '8. Environmental & Special Requirements',
    fields: ['corrosionClass', 'corrosionClassCustom', 'noiseBarriers', 'altitude', 'maxAmbient', 'minAmbient'],
  },
  {
    title: '9. Testing Requirements',
    fields: ['testing', 'partialDischargeLimit', 'optionalUploads'],
  },
  {
    title: '10. Compliance',
    fields: ['governingStandards'],
  },
  {
    title: '11. Additional Notes',
    fields: ['additionalNotes'],
  },
];

export function formatValue(val: string): string {
  return VALUE_FORMAT_MAP[val] ?? val;
}
