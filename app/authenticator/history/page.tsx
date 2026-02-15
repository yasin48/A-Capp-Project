'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionWrapper, StaggerContainer, FadeItem } from '@/components/MotionWrapper';
import { CheckCircle2, XCircle, Calendar, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const dynamic = 'force-dynamic';

interface VerificationHistory {
    verificationId: string;
    decision: 'authentic' | 'not_authentic';
    notes: string | null;
    verifiedAt: string;
    product: {
        id: string;
        serial_number: string;
        brand: string;
        product_name: string;
        status: string;
        images: string[];
    };
}

export default function AuthenticatorHistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [history, setHistory] = useState<VerificationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            fetchHistory();
        }
    }, [user, authLoading]);

    const fetchHistory = async () => {
        try {
            const response = await fetch('/api/verification/history');
            const result = await response.json();
            if (result.success) {
                setHistory(result.data);
            } else {
                setError(result.error || 'Failed to fetch history');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item =>
        item.product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const authenticCount = history.filter(h => h.decision === 'authentic').length;
    const notAuthenticCount = history.filter(h => h.decision === 'not_authentic').length;

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-slate-500 font-medium">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-200 mb-8 pt-24 pb-8">
                <div className="container mx-auto px-6">
                    <MotionWrapper>
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-slate-900 mb-1">
                                    Verification History
                                </h1>
                                <p className="text-slate-500">
                                    All products you've verified on the platform.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-xs text-green-600 font-medium">Authentic</div>
                                    <div className="text-2xl font-bold text-green-700">{authenticCount}</div>
                                </div>
                                <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="text-xs text-red-600 font-medium">Not Authentic</div>
                                    <div className="text-2xl font-bold text-red-700">{notAuthenticCount}</div>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="text-xs text-slate-600 font-medium">Total</div>
                                    <div className="text-2xl font-bold text-slate-700">{history.length}</div>
                                </div>
                            </div>
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

                <div className="mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search by brand, product, or serial..."
                            className="pl-10 h-10 bg-white border-slate-200 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredHistory.length === 0 ? (
                    <MotionWrapper delay={0.2}>
                        <div className="text-center py-20 max-w-md mx-auto">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {searchTerm ? 'No matching verifications' : 'No verification history'}
                            </h3>
                            <p className="text-slate-500">
                                {searchTerm
                                    ? `No verifications found matching "${searchTerm}"`
                                    : "You haven't verified any products yet."
                                }
                            </p>
                        </div>
                    </MotionWrapper>
                ) : (
                    <StaggerContainer className="space-y-4">
                        {filteredHistory.map((item) => (
                            <FadeItem key={item.verificationId}>
                                <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product.images && item.product.images.length > 0 ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-slate-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                                                        {item.product.brand}
                                                    </div>
                                                    <h3 className="font-bold text-lg text-slate-900">
                                                        {item.product.product_name}
                                                    </h3>
                                                    <div className="text-xs font-mono text-slate-400 mt-1">
                                                        #{item.product.serial_number}
                                                    </div>
                                                </div>

                                                {/* Decision Badge */}
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${item.decision === 'authentic'
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}
                                                >
                                                    {item.decision === 'authentic' ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Verified Authentic
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Not Authentic
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            {/* Notes */}
                                            {item.notes && (
                                                <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <div className="text-xs text-slate-500 font-medium mb-1">Notes:</div>
                                                    <p className="text-sm text-slate-700">{item.notes}</p>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Verified {new Date(item.verifiedAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs">
                                                    Status: <span className="font-medium">{item.product.status}</span>
                                                </div>
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
