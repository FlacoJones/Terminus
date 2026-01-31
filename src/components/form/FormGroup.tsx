import type { ReactNode } from 'react';
import styles from './Form.module.css';

interface FormGroupProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

export function FormGroup({ label, htmlFor, children }: FormGroupProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

interface FormRowProps {
  children: ReactNode;
}

export function FormRow({ children }: FormRowProps) {
  return <div className={styles.formRow}>{children}</div>;
}
