'use server';

import type { ContactFormData, APISubmission } from '@/types/forms';
import { FIELD_LABELS, REVIEW_SECTIONS, formatValue } from '@/types/forms';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

interface EmailResult {
  success: boolean;
  error?: string;
}

async function sendEmail(
  to: string,
  subject: string,
  body: string,
  from?: string
): Promise<EmailResult> {
  try {
    // Validate Mailgun configuration
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error('Missing Mailgun configuration');
      return { success: false, error: 'Email service not configured' };
    }

    // Default from address if not provided
    const fromEmail = from ?? `Terminus Industrials <sales@${MAILGUN_DOMAIN}>`;

    // Send via Mailgun API
    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: fromEmail,
          to: to,
          subject: subject,
          text: body,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Mailgun error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

// Format API submission for email
function formatSubmissionForEmail(submissionData: APISubmission): string {
  const lines: string[] = [];

  REVIEW_SECTIONS.forEach((section) => {
    const sectionLines: string[] = [];

    section.fields.forEach((field) => {
      const value = submissionData[field as keyof APISubmission];
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const label = FIELD_LABELS[field] ?? field;
      let displayValue: string;

      if (Array.isArray(value)) {
        displayValue = value.map((v) => formatValue(String(v))).join(', ');
      } else {
        displayValue = formatValue(String(value));
      }

      sectionLines.push(`${label}: ${displayValue}`);
    });

    if (sectionLines.length > 0) {
      lines.push(`\n--- ${section.title} ---`);
      lines.push(...sectionLines);
    }
  });

  lines.push('\n--- Submission Info ---');
  lines.push(`Submission ID: ${submissionData.id}`);
  if (submissionData.submittedAt) {
    lines.push(`Submitted At: ${new Date(submissionData.submittedAt).toLocaleString()}`);
  }

  return lines.join('\n');
}

// Server action: Send contact form emails
export async function submitContactForm(data: ContactFormData): Promise<EmailResult> {
  const { name, company, email, subject, message } = data;

  // Email 1: Send confirmation to user
  const userConfirmationBody = `Thank you for contacting Terminus Industrials. Someone from our team will contact you soon.\n\n---\n\nSubject: ${subject}\n\nMessage: ${message}`;
  const userResult = await sendEmail(
    email,
    'Thank you for contacting Terminus Industrials!',
    userConfirmationBody,
    'Terminus Industrials <contact@terminusindustrials.com>'
  );

  if (!userResult.success) {
    return userResult;
  }

  // Email 2: Send to Terminus contact
  const internalBody = `Subject: ${subject}\n\nMessage: ${message}`;
  const internalResult = await sendEmail(
    'contact@terminusindustrials.com',
    `Inquiry from ${company} ${email}`,
    internalBody,
    `${name} <${email}>`
  );

  return internalResult;
}

// Server action: Submit API form
export async function submitAPIForm(data: APISubmission): Promise<EmailResult> {
  const { contactEmail, companyName } = data;
  const formattedSubmission = formatSubmissionForEmail(data);

  const results: EmailResult[] = [];

  // Email 1: Confirmation to the customer
  if (contactEmail) {
    const userConfirmationBody = `Thank you for submitting an Advance Purchase Indication to Terminus Industrials. Someone from our team will contact you soon.\n\n${formattedSubmission}`;
    const userResult = await sendEmail(
      contactEmail,
      'Thank you for submitting an Advance Purchase Indication to Terminus Industrials',
      userConfirmationBody,
      'Terminus Industrials <sales@terminusindustrials.com>'
    );
    results.push(userResult);
  }

  // Email 2: Internal notification to sales team
  const internalBody = `New API Submission received.\n\n${formattedSubmission}`;
  const internalResult = await sendEmail(
    'sales@terminusindustrials.com',
    `API Submission from ${contactEmail ?? 'unknown'} at ${companyName ?? 'Unknown Company'}`,
    internalBody,
    'Terminus Industrials <sales@terminusindustrials.com>'
  );
  results.push(internalResult);

  // Return error if any email failed
  const failedResult = results.find((r) => !r.success);
  if (failedResult) {
    return failedResult;
  }

  return { success: true };
}
