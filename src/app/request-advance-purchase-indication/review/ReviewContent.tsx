'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SuccessModal } from '@/components';
import { submitAPIForm } from '@/actions/email';
import type { APISubmission } from '@/types/forms';
import { FIELD_LABELS, REVIEW_SECTIONS, formatValue } from '@/types/forms';
import styles from './ReviewContent.module.css';

export function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const submissionId = searchParams.get('id');

  const [data, setData] = useState<APISubmission | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!submissionId) {
      setNotFound(true);
      return;
    }

    const saved = localStorage.getItem('nbpo_' + submissionId);
    if (!saved) {
      setNotFound(true);
      return;
    }

    try {
      setData(JSON.parse(saved) as APISubmission);
    } catch {
      setNotFound(true);
    }
  }, [submissionId]);

  const handleConfirmSubmission = () => {
    if (!data) return;

    const submissionData = {
      ...data,
      submittedAt: new Date().toISOString(),
    };

    startTransition(async () => {
      const result = await submitAPIForm(submissionData);
      if (result.success) {
        setShowSuccess(true);
      } else {
        console.error('Failed to submit:', result.error);
        alert('Failed to submit. Please try again.');
      }
    });
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.push('/');
  };

  if (notFound) {
    return (
      <div className={styles.notFound}>
        <h2>Submission Not Found</h2>
        <p>We couldn&apos;t find a submission with ID: {submissionId}</p>
        <Link href="/request-advance-purchase-indication" className={styles.btnEdit}>
          Start New Request
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  const renderValue = (value: unknown): string | JSX.Element => {
    if (Array.isArray(value)) {
      return (
        <span className={styles.tagList}>
          {value.map((v, i) => (
            <span key={i} className={styles.tag}>
              {formatValue(String(v))}
            </span>
          ))}
        </span>
      );
    }
    return formatValue(String(value));
  };

  return (
    <>
      <div className={styles.reviewHeader}>
        <h1 className={styles.reviewTitle}>Review Your Submission</h1>
        <span className={styles.reviewId}>ID: {submissionId}</span>
      </div>

      <div className={styles.reviewActions}>
        <Link
          href={`/request-advance-purchase-indication?edit=${submissionId}`}
          className={styles.btnEdit}
        >
          ← Edit Submission
        </Link>
        <button
          type="button"
          className={styles.btnConfirm}
          onClick={handleConfirmSubmission}
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit API'}
        </button>
      </div>

      {REVIEW_SECTIONS.map((section) => {
        const hasValues = section.fields.some((field) => {
          const val = data[field as keyof APISubmission];
          return val && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '');
        });

        if (!hasValues) return null;

        return (
          <div key={section.title} className={styles.reviewSection}>
            <h2 className={styles.reviewSectionTitle}>{section.title}</h2>
            <div className={styles.reviewGrid}>
              {section.fields.map((field) => {
                const value = data[field as keyof APISubmission];
                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                const label = FIELD_LABELS[field] ?? field;
                const isFullWidth = field === 'siteFootprint' || field === 'additionalNotes';

                return (
                  <div
                    key={field}
                    className={`${styles.reviewItem} ${isFullWidth ? styles.fullWidth : ''}`}
                  >
                    <span className={styles.reviewLabel}>{label}</span>
                    <div
                      className={`${styles.reviewValue} ${
                        Array.isArray(value) ? styles.list : ''
                      }`}
                    >
                      {renderValue(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className={styles.reviewActionsBottom}>
        <Link
          href={`/request-advance-purchase-indication?edit=${submissionId}`}
          className={styles.btnEdit}
        >
          ← Edit Submission
        </Link>
        <button
          type="button"
          className={styles.btnConfirm}
          onClick={handleConfirmSubmission}
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit API'}
        </button>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        title="Thank You!"
        message={
          data?.contactEmail
            ? `We sent a verification email to ${data.contactEmail}`
            : 'Thank you for submitting an Advance Purchase Indication with Terminus Industrials'
        }
        subMessage="A member of our team will contact you soon."
      />
    </>
  );
}
