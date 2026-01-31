import type { ReactNode } from 'react';
import styles from './Form.module.css';

interface FormFieldsetProps {
  legend: string;
  note?: string;
  children: ReactNode;
}

export function FormFieldset({ legend, note, children }: FormFieldsetProps) {
  return (
    <fieldset className={styles.formFieldset}>
      <legend>{legend}</legend>
      {note && <p className={styles.fieldsetNote}>{note}</p>}
      {children}
    </fieldset>
  );
}
