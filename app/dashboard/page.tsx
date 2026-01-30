'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  serial_number: string;
  brand: string;
  product_name: string;
  status: string;
  submitted_at: string;
  images: string[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts();
    }
  }, [user, authLoading]);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/products');
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      authentic: 'bg-green-100 text-green-800',
      not_authentic: 'bg-red-100 text-red-800',
      certified: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
          <Link
            href="/login"
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Products</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.email}</p>
          </div>
          <Link
            href="/submit"
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Submit New Product
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No products submitted yet.</p>
            <Link
              href="/submit"
              className="text-primary-600 hover:text-primary-700"
            >
              Submit your first product →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      {product.product_name}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Brand:</span> {product.brand}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Serial Number:</span>{' '}
                      {product.serial_number}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Submitted:</span>{' '}
                      {formatDate(product.submitted_at)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {product.images && product.images.length > 0 && (
                    <div className="ml-4">
                      <img
                        src={product.images[0]}
                        alt={product.product_name}
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
