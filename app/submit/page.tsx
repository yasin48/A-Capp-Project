import ProductSubmissionForm from '@/components/ProductSubmissionForm';
import { MotionWrapper } from '@/components/MotionWrapper';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <MotionWrapper>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-heading font-bold text-slate-900 mb-3">Submit a Product</h1>
            <p className="text-slate-500 text-lg">Initialize the verification process on the blockchain ledger.</p>
          </div>
          <ProductSubmissionForm />
        </MotionWrapper>
      </div>
    </div>
  );
}
