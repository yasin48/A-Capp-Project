'use client';

import ProductSubmissionForm from '@/components/ProductSubmissionForm';
import Link from 'next/link';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Link
          href="/dashboard"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <ProductSubmissionForm />
      </div>
    </div>
  );
}
