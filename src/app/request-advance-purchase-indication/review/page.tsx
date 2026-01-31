import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components';
import { ReviewContent } from './ReviewContent';

export const metadata: Metadata = {
  title: 'Review Your API - Terminus Industrials',
  description: 'Review Your API - Terminus Industrials',
};

function ReviewLoadingFallback() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--brand-gray)' }}>
      Loading review...
    </div>
  );
}

export default function ReviewPage() {
  return (
    <>
      <Navbar />

      <main className="form-page-container">
        <div className="form-wrapper">
          <Suspense fallback={<ReviewLoadingFallback />}>
            <ReviewContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
