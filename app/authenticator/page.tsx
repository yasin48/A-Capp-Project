'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionWrapper, StaggerContainer, FadeItem } from '@/components/MotionWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Package, Calendar, User, CheckCircle2, XCircle, Shield, ArrowRight, AlertCircle, FileText } from 'lucide-react';



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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [decision, setDecision] = useState<'authentic' | 'not_authentic'>('authentic');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!authLoading && user && (role === 'authenticator' || role === 'admin')) {
      fetchPendingProducts();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, role, authLoading]);

  const fetchPendingProducts = async () => {
    try {
      const response = await fetch('/api/verification/pending');
      const result = await response.json();
      if (result.success) setProducts(result.data);
    } catch (err) {
      console.error('Error:', err);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct.id, decision, notes }),
      });
      const result = await response.json();
      if (result.success) {
        setSelectedProduct(null);
        setNotes('');
        fetchPendingProducts();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user || (role !== 'authenticator' && role !== 'admin')) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <GlassCard className="max-w-md text-center p-8">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Restricted Access</h2>
        <p className="text-slate-500 mb-6">This area is for verified authenticators only.</p>
        <Link href="/dashboard"><Button className="w-full">Return to Dashboard</Button></Link>
      </GlassCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 mb-8 pt-24 pb-8 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6">
          <MotionWrapper>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Authenticator Workspace</h1>
                </div>
                <p className="text-slate-500">
                  {products.length} product{products.length !== 1 && 's'} awaiting verification
                </p>
              </div>
              <Link href="/authenticator/history">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  History
                </Button>
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-slate-400 text-sm uppercase tracking-wider">Queue</h3>
            {products.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">All caught up!</p>
                <p className="text-sm text-slate-400">No pending verifications.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedProduct?.id === p.id ? 'bg-primary text-white shadow-lg shadow-primary/25 border-primary' : 'bg-white hover:bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold">{p.product_name}</h4>
                      <span className="text-xs opacity-70">{new Date(p.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm ${selectedProduct?.id === p.id ? 'text-primary-100' : 'text-slate-500'}`}>{p.brand}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Detail Section */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-slate-400 text-sm uppercase tracking-wider mb-4">Verification Station</h3>
            {selectedProduct ? (
              <GlassCard className="p-6 md:p-8 animate-fade-in-up">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-1">{selectedProduct.product_name}</h2>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-medium text-slate-900">{selectedProduct.brand}</span>
                      <span>•</span>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">SN: {selectedProduct.serial_number}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Submitted by</div>
                    <div className="font-medium text-slate-600">{selectedProduct.user_email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {selectedProduct.images?.map((img, i) => (
                    <img key={i} src={img} className="w-full h-48 object-cover rounded-lg border border-slate-100 bg-slate-50" alt="Product" />
                  ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                  <Label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block">Description</Label>
                  <p className="text-slate-700 leading-relaxed">{selectedProduct.description || "No description provided."}</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div>
                    <Label className="mb-3 block">Verdict Decision</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setDecision('authentic')}
                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${decision === 'authentic' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-bold">Authentic</span>
                      </button>
                      <button
                        onClick={() => setDecision('not_authentic')}
                        className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${decision === 'not_authentic' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <XCircle className="w-5 h-5" />
                        <span className="font-bold">Counterfeit / Invalid</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label>Verification Notes</Label>
                    <textarea
                      className="w-full mt-2 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
                      placeholder="Add technical notes about your finding..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedProduct(null)}>Cancel</Button>
                    <Button className="flex-[2] bg-slate-900 hover:bg-slate-800" disabled={verifying} onClick={handleVerify}>
                      {verifying ? 'Processing on Blockchain...' : 'Submit Verification'}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p>Select a product from the queue to verify</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
