'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const [ready, setReady] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      // Dismiss the mobile keyboard first so the viewport is full-size
      // before we render the modal.
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Give the keyboard time to fully dismiss and the viewport to
      // resize before showing the overlay (300ms covers iOS animation).
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        setReady(true);
      }, 350);

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }

    setReady(false);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen || !ready) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeX} onClick={onClose}>
          &times;
        </button>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

// Success Modal variant
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  subMessage?: string;
}

export function SuccessModal({ isOpen, onClose, title, message, subMessage }: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.thankYouContent}>
        <h2 className={styles.thankYouTitle}>{title}</h2>
        <p className={styles.thankYouMessage}>{message}</p>
        {subMessage && <p className={styles.thankYouHighlight}>{subMessage}</p>}
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
