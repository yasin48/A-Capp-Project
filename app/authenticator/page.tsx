'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Package, Calendar, User, CheckCircle2, XCircle, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state first to prevent flash during logout
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  // If no user, return null and let middleware handle redirect
  if (!user) {
    return null;
  }

  // Check if user has authenticator role
  if (role !== 'authenticator') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Unauthorized Access</CardTitle>
            <CardDescription className="text-base">
              You do not have permission to access the authenticator dashboard.
              Only users with the authenticator role can verify products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Authenticator Dashboard
            </CardTitle>
            <CardDescription className="text-base">
              Review and verify pending product submissions
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Pending Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pending Verifications</h2>
          <p className="text-slate-600">Products awaiting authentication review</p>
        </div>

        {products.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <CardTitle className="text-xl text-slate-600">No pending verifications</CardTitle>
              <CardDescription className="text-base">
                All products have been reviewed
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
                  <CardTitle className="text-lg">{product.product_name}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      SN: {product.serial_number}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {product.user_email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(product.submitted_at)}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Review Product
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Verification Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Verify Product</CardTitle>
                <CardDescription>Review product details and make your decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Images */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border-2"
                      />
                    ))}
                  </div>
                )}

                {/* Product Details */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Product Name</Label>
                    <p className="font-medium">{selectedProduct.product_name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Brand</Label>
                    <p className="font-medium">{selectedProduct.brand}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Serial Number</Label>
                    <p className="font-medium">{selectedProduct.serial_number}</p>
                  </div>
                  {selectedProduct.description && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm">{selectedProduct.description}</p>
                    </div>
                  )}
                </div>

                {/* Decision */}
                <div className="space-y-3">
                  <Label>Verification Decision</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={decision === 'authentic' ? 'default' : 'outline'}
                      className="gap-2"
                      onClick={() => setDecision('authentic')}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Authentic
                    </Button>
                    <Button
                      type="button"
                      variant={decision === 'not_authentic' ? 'destructive' : 'outline'}
                      className="gap-2"
                      onClick={() => setDecision('not_authentic')}
                    >
                      <XCircle className="w-4 h-4" />
                      Not Authentic
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Verification Notes</Label>
                  <textarea
                    id="notes"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Add notes about your verification decision..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(null);
                      setNotes('');
                    }}
                    disabled={verifying}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleVerify}
                    disabled={verifying}
                  >
                    {verifying ? 'Submitting...' : 'Submit Verification'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
