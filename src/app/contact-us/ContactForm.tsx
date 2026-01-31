'use client';

import { useState, useTransition } from 'react';
import { submitContactForm } from '@/actions/email';
import { SuccessModal, SubmitButton } from '@/components';
import type { ContactFormData } from '@/types/forms';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (formData: FormData) => {
    const data: ContactFormData = {
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    startTransition(async () => {
      const result = await submitContactForm(data);
      if (result.success) {
        setShowSuccess(true);
        // Reset the form
        const form = document.getElementById('contactForm') as HTMLFormElement;
        form?.reset();
      } else {
        console.error('Failed to send message:', result.error);
        alert('Failed to send message. Please try again.');
      }
    });
  };

  return (
    <>
      <form id="contactForm" className={styles.contactForm} action={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="contactName">Name</label>
          <input type="text" id="contactName" name="name" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contactCompany">Company</label>
          <input type="text" id="contactCompany" name="company" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contactEmail">Email</label>
          <input type="email" id="contactEmail" name="email" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contactSubject">Subject</label>
          <input type="text" id="contactSubject" name="subject" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contactMessage">Message</label>
          <textarea id="contactMessage" name="message" rows={4} required />
        </div>
        <SubmitButton className={styles.submitBtn}>
          {isPending ? 'Sending...' : 'Send Message'}
        </SubmitButton>
      </form>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Message Sent!"
        message="Your message was sent successfully!"
        subMessage="Our team will reach out to you shortly."
      />
    </>
  );
}
