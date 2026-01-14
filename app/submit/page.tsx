import ProductSubmissionForm from '@/components/ProductSubmissionForm';
import Link from 'next/link';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <ProductSubmissionForm />
      </div>
    </div>
  );
}
