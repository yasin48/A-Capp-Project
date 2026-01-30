'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  serial_number: string;
  brand: string;
  product_name: string;
  description: string;
  images: string[];
  status: string;
  submitted_at: string;
  user_email: string;
}

export default function AuthenticatorPage() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [decision, setDecision] = useState<'authentic' | 'not_authentic'>('authentic');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!authLoading && user && role === 'authenticator') {
      fetchPendingProducts();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, role, authLoading]);

  const fetchPendingProducts = async () => {
    try {
      const response = await fetch('/api/verification/pending');
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedProduct) return;

    setVerifying(true);
    try {
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          decision,
          notes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // If authentic, create certificate and store on blockchain
        if (decision === 'authentic') {
          await createCertificateAndStoreOnBlockchain(selectedProduct.id);
        }
        setSelectedProduct(null);
        setNotes('');
        fetchPendingProducts();
      } else {
        alert(result.error || 'Failed to verify product');
      }
    } catch (err) {
      console.error('Error verifying product:', err);
      alert('An error occurred');
    } finally {
      setVerifying(false);
    }
  };

  const createCertificateAndStoreOnBlockchain = async (productId: string) => {
    try {
      // Create certificate
      const certResponse = await fetch('/api/certificates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const certResult = await certResponse.json();

      if (certResult.success) {
        // Store on blockchain
        const blockchainResponse = await fetch('/api/blockchain/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            certificateId: certResult.data.certificateId,
            productId,
          }),
        });

        const blockchainResult = await blockchainResponse.json();
        if (blockchainResult.success) {
          alert(
            `Product verified and stored on blockchain!\nTransaction: ${blockchainResult.data.txHash}`
          );
        }
      }
    } catch (err) {
      console.error('Error creating certificate:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Check if user has authenticator role
  if (!user || role !== 'authenticator') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access the authenticator dashboard.
            Only users with the authenticator role can verify products.
          </p>
          <Link
            href="/dashboard"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Authenticator Dashboard</h1>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Home
          </Link>
        </div>

        {selectedProduct ? (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Review Product</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p className="mb-2">
                  <span className="font-medium">Name:</span> {selectedProduct.product_name}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Brand:</span> {selectedProduct.brand}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Serial Number:</span>{' '}
                  {selectedProduct.serial_number}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Description:</span>{' '}
                  {selectedProduct.description || 'N/A'}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Submitted by:</span>{' '}
                  {selectedProduct.user_email}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Decision *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="authentic"
                    checked={decision === 'authentic'}
                    onChange={(e) => setDecision(e.target.value as 'authentic')}
                    className="mr-2"
                  />
                  Authentic
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="not_authentic"
                    checked={decision === 'not_authentic'}
                    onChange={(e) =>
                      setDecision(e.target.value as 'not_authentic')
                    }
                    className="mr-2"
                  />
                  Not Authentic
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Notes
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add verification notes..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
              >
                {verifying ? 'Processing...' : 'Submit Verification'}
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setNotes('');
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Pending Verifications ({products.length})
            </h2>

            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No pending products to verify.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {product.product_name}
                        </h3>
                        <p className="text-gray-600">
                          {product.brand} • {product.serial_number}
                        </p>
                      </div>
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.product_name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
