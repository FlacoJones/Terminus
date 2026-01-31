'use client';

import { useState, type ChangeEvent } from 'react';
import styles from './Form.module.css';

interface RadioOption {
  value: string;
  label: string;
  hasOtherInput?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  label?: string;
  otherInputName?: string;
}

export function RadioGroup({
  name,
  options,
  defaultValue,
  label,
  otherInputName,
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? '');
  const [otherDisabled, setOtherDisabled] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    
    // Enable "other" input if applicable
    const otherOption = options.find((opt) => opt.hasOtherInput);
    if (otherOption) {
      setOtherDisabled(value !== otherOption.value);
    }
  };

  return (
    <div className={styles.formGroup}>
      {label && <label>{label}</label>}
      <div className={styles.radioGroup}>
        {options.map((option) => (
          <label key={option.value} className={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
            {option.label}
            {option.hasOtherInput && otherInputName && (
              <input
                type="text"
                name={otherInputName}
                className={styles.inlineInput}
                placeholder="Specify"
                disabled={otherDisabled}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  defaultValues?: string[];
  label?: string;
  grid?: boolean;
}

export function CheckboxGroup({
  name,
  options,
  defaultValues = [],
  label,
  grid = false,
}: CheckboxGroupProps) {
  return (
    <div className={styles.formGroup}>
      {label && <label>{label}</label>}
      <div className={grid ? styles.checkboxGrid : styles.checkboxGroup}>
        {options.map((option) => (
          <label key={option.value} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
