'use client';

import { useState } from 'react';
import Link from 'next/link';

interface VerificationResult {
  verified: boolean;
  exists: boolean;
  productId?: string;
  timestamp?: string;
  certificate?: {
    productId: string;
    decision: string;
    timestamp: string;
    reason: string;
  };
  blockchainRecord?: {
    txHash: string;
    blockNumber: number;
    network: string;
  };
  message?: string;
}

export default function VerifyPage() {
  const [hash, setHash] = useState('');
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const params = new URLSearchParams();
      if (hash) params.append('hash', hash);
      if (productId) params.append('productId', productId);

      const response = await fetch(`/api/verify?${params.toString()}`);
      const verifyResult = await response.json();

      if (verifyResult.success) {
        setResult(verifyResult.data);
      } else {
        setError(verifyResult.error || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Verify Product Authenticity</h1>
            <p className="text-gray-600">
              Enter a product hash or product ID to verify its authenticity on the blockchain
            </p>
          </div>

          <form onSubmit={handleVerify} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="hash">
                Certificate Hash
              </label>
              <input
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                id="hash"
                type="text"
                placeholder="Enter hash (64 character hex string)"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <div className="text-center text-gray-500 mb-2">OR</div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="productId">
                Product ID
              </label>
              <input
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                id="productId"
                type="text"
                placeholder="Enter product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!hash && !productId)}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Product'}
            </button>
          </form>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Verification Result</h2>

              {result.verified ? (
                <div className="space-y-4">
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">✅</span>
                      <span className="font-bold">Product Verified as Authentic</span>
                    </div>
                  </div>

                  {result.certificate && (
                    <div className="border rounded p-4">
                      <h3 className="font-semibold mb-2">Certificate Details</h3>
                      <p className="mb-1">
                        <span className="font-medium">Product ID:</span>{' '}
                        {result.certificate.productId}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Decision:</span>{' '}
                        {result.certificate.decision}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Timestamp:</span>{' '}
                        {new Date(result.certificate.timestamp).toLocaleString()}
                      </p>
                      {result.certificate.reason && (
                        <p className="mb-1">
                          <span className="font-medium">Reason:</span>{' '}
                          {result.certificate.reason}
                        </p>
                      )}
                    </div>
                  )}

                  {result.blockchainRecord && (
                    <div className="border rounded p-4">
                      <h3 className="font-semibold mb-2">Blockchain Record</h3>
                      <p className="mb-1">
                        <span className="font-medium">Network:</span>{' '}
                        {result.blockchainRecord.network}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Block Number:</span>{' '}
                        {result.blockchainRecord.blockNumber}
                      </p>
                      <p className="mb-1 break-all">
                        <span className="font-medium">Transaction Hash:</span>{' '}
                        <code className="text-sm">{result.blockchainRecord.txHash}</code>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">❌</span>
                    <span className="font-bold">
                      {result.message || 'Product could not be verified'}
                    </span>
                  </div>
                  {!result.exists && (
                    <p className="mt-2">
                      The hash or product ID was not found on the blockchain.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
