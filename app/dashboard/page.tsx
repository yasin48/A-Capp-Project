'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionWrapper, StaggerContainer, FadeItem } from '@/components/MotionWrapper';
import { Plus, Package, Calendar, CheckCircle2, Clock, XCircle, Shield, Search, FileText, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { pdf } from '@react-pdf/renderer';
import { Certificate } from '@/components/Certificate';
import QRCode from 'qrcode';



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
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts();
    }
  }, [user, authLoading]);

  // Refetch when window regains focus (handles navigation back from submit)
  useEffect(() => {
    const handleFocus = () => {
      if (user) fetchProducts();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setProducts(result.data);
      else setError(result.error || 'Failed to fetch products');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (productId: string, productName: string) => {
    try {
      setDownloadingId(productId);

      // 1. Fetch certificate data
      const response = await fetch(`/api/certificates/generate?productId=${productId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate certificate data');
      }

      // 2. Generate QR Code
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://a-capp-project-three.vercel.app';
      const qrCodeUrl = await QRCode.toDataURL(
        `${siteUrl}/verify/${result.data.serialNumber}`,
        { margin: 1, width: 200 }
      );

      // 3. Generate PDF Blob
      const blob = await pdf(
        <Certificate
          data={{
            ...result.data,
            qrCodeUrl
          }}
        />
      ).toBlob();

      // 4. Trigger Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${productName.replace(/\s+/g, '-')}-${result.data.serialNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending Review' },
      under_review: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Shield, label: 'Under Review' },
      authentic: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2, label: 'Verified Authentic' },
      certified: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Blockchain Certified' },
      not_authentic: { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle, label: 'Failed Verification' },
    };
    const badge = badges[status] || { color: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock, label: status };
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    );
  };

  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // Middleware will handle redirect

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 mb-8 pt-24 pb-8">
        <div className="container mx-auto px-6">
          <MotionWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 mb-1">
                  Dashboard
                </h1>
                <p className="text-slate-500">
                  Manage and track your product authentications.
                </p>
              </div>
              <Link href="/submit">
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Product
                </Button>
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-600 mb-6 border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-10 bg-white border-slate-200 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            {/* Quick stats could go here */}
            <strong>{products.length}</strong> Total Products
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <MotionWrapper delay={0.2}>
            {searchTerm ? (
              <div className="text-center py-20">
                <p className="text-slate-500">No products found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-20 max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products yet</h3>
                <p className="text-slate-500 mb-8">
                  Submit your first product for verification to get started with the blockchain ledger.
                </p>
                <Link href="/submit">
                  <Button variant="outline" className="rounded-full">
                    Submit First Product
                  </Button>
                </Link>
              </div>
            )}
          </MotionWrapper>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <FadeItem key={product.id}>
                <GlassCard className="h-full flex flex-col group overflow-hidden border-slate-200/60">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(product.status)}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                        {product.brand}
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                        {product.product_name}
                      </h3>
                      <div className="text-xs font-mono text-slate-400 mt-1 truncate">
                        #{product.serial_number}
                      </div>
                    </div>


                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(product.submitted_at).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        {(product.status === 'authentic' || product.status === 'certified') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-indigo-50 text-indigo-600"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownloadCertificate(product.id, product.product_name);
                            }}
                            disabled={downloadingId === product.id}
                            title="Download Certificate"
                          >
                            {downloadingId === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </FadeItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
