'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Calendar, CheckCircle2, Clock, XCircle, Shield } from 'lucide-react';

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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending' },
      under_review: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Shield, label: 'Under Review' },
      authentic: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, label: 'Verified' },
      not_authentic: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Not Authentic' },
      certified: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: CheckCircle2, label: 'Certified' },
    };
    const badge = badges[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, label: status };
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription className="text-base">{user.email}</CardDescription>
          </CardHeader>
        </Card>

        {/* Submit New Product Card */}
        <Link href="/submit">
          <Card className="mb-8 border-2 border-primary/20 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Submit New Product</CardTitle>
              <CardDescription className="text-base">
                Submit a product for authentication verification
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Products</h2>
          <p className="text-slate-600">Track the authentication status of your submitted products</p>
        </div>

        {products.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <CardTitle className="text-xl text-slate-600">No products yet</CardTitle>
              <CardDescription className="text-base">
                Submit your first product to get started with authentication
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {product.images && product.images.length > 0 && (
                    <div className="w-full h-48 bg-slate-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                    {getStatusBadge(product.status)}
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      SN: {product.serial_number}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(product.submitted_at)}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
