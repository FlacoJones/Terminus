'use client';

import { useFormStatus } from 'react-dom';
import styles from './Form.module.css';

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${styles.submitButton} ${pending ? styles.loading : ''} ${className ?? ''}`}
    >
      <span className={styles.btnText}>{children}</span>
    </button>
  );
}
