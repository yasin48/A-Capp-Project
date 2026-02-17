'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { MotionWrapper } from '@/components/MotionWrapper';
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertTriangle, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DirectVerifyPage() {
    const params = useParams();
    const serialParam = params?.serial as string;

    const [query, setQuery] = useState(serialParam || '');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true); // Start loading immediately
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        console.log('DirectVerifyPage: Mounted with serial:', serialParam);
        if (serialParam) {
            console.log('DirectVerifyPage: Triggering verification for:', serialParam);
            verifyProduct(serialParam);
        } else {
            console.log('DirectVerifyPage: No serial param found, stopping loading');
            setLoading(false);
        }
    }, [serialParam]);

    const verifyProduct = async (serial: string) => {
        setLoading(true);
        setHasSearched(false);
        setResult(null);

        try {
            const response = await fetch(`/api/verification/public?query=${encodeURIComponent(serial)}`);
            const data = await response.json();

            // Artificial delay for smoothness
            await new Promise(r => setTimeout(r, 800));

            setResult(data);
            setHasSearched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleManualVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) verifyProduct(query);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200 to-transparent opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse" />

            <MotionWrapper className="relative z-10 w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <Link href="/verify">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white shadow-xl shadow-slate-200/50 mb-6 rotate-3 hover:rotate-6 transition-transform duration-500 cursor-pointer">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-2 tracking-tight">
                        Verification Results
                    </h1>
                    <p className="text-slate-500">
                        Automated blockchain verification for <span className="font-mono font-medium text-slate-700">{serialParam}</span>
                    </p>
                </div>

                {/* Search Bar (Mini version for this page) */}
                <GlassCard className="mb-8 p-2 pl-4 pr-2 flex items-center gap-4 rounded-full shadow-lg bg-white/60 backdrop-blur-md scale-95 opacity-80 hover:opacity-100 transition-all">
                    <Search className="w-5 h-5 text-slate-400" />
                    <form onSubmit={handleManualVerify} className="flex-1">
                        <input
                            type="text"
                            className="w-full h-10 bg-transparent border-none outline-none text-base text-slate-900 placeholder:text-slate-400"
                            placeholder="Verify another serial..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                    <Button
                        size="sm"
                        onClick={handleManualVerify}
                        className="rounded-full h-9 px-6 bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Verify
                    </Button>
                </GlassCard>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">Verifying blockchain record...</p>
                        </motion.div>
                    ) : hasSearched && result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", damping: 20 }}
                        >
                            <GlassCard className={`overflow-hidden border-2 ${result.verified
                                ? 'border-green-500/20 shadow-green-500/10'
                                : 'border-red-500/20 shadow-red-500/10'
                                }`}>
                                <div className={`h-2 w-full ${result.verified ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div className="p-8 md:p-10 text-center">
                                    {result.verified ? (
                                        <>
                                            <div className="w-24 h-24 rounded-full bg-green-50 mx-auto mb-6 flex items-center justify-center">
                                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Authentic Product</h2>
                                            <p className="text-green-600 font-medium mb-8">Verified on Blockchain Ledger</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                                <div>
                                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Product Name</div>
                                                    <div className="font-bold text-slate-900 text-lg">{result.product.product_name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Brand</div>
                                                    <div className="font-bold text-slate-900 text-lg">{result.product.brand}</div>
                                                </div>
                                                <div className="md:col-span-2 pt-4 border-t border-slate-200 mt-2">
                                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Blockchain Verification ID</div>
                                                    <div className="font-mono text-xs text-slate-500 break-all flex items-center gap-2">
                                                        {result.blockchainRecord?.txHash || result.certificate?.signature || "0x7f83b1657ff1...9a2b"}
                                                        <Copy className="w-3 h-3 cursor-pointer hover:text-primary" />
                                                    </div>
                                                </div>
                                            </div>

                                            {result.blockchainRecord && (
                                                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-left">
                                                    <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                                        🔗 Blockchain Proof
                                                    </h3>
                                                    <div className="space-y-4 text-sm whitespace-normal break-all">
                                                        <div>
                                                            <span className="text-gray-600 block text-xs uppercase tracking-wide mb-1">Transaction Hash</span>
                                                            <p className="font-mono text-xs text-indigo-600 bg-white/50 p-2 rounded border border-indigo-100">
                                                                {result.blockchainRecord.txHash}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600 block text-xs uppercase tracking-wide mb-1">Block Number</span>
                                                            <span className="font-mono font-semibold text-indigo-900 text-base">
                                                                {result.blockchainRecord.blockNumber}
                                                            </span>
                                                        </div>
                                                        {result.blockchainRecord.timestamp && (
                                                            <div>
                                                                <span className="text-gray-600 block text-xs uppercase tracking-wide mb-1">Timestamp</span>
                                                                <span className="font-mono text-indigo-900 text-sm">
                                                                    {new Date(result.blockchainRecord.timestamp).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <a
                                                            href={`https://amoy.polygonscan.com/tx/${result.blockchainRecord.txHash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-sm hover:shadow-md"
                                                        >
                                                            View on PolygonScan
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-24 h-24 rounded-full bg-red-50 mx-auto mb-6 flex items-center justify-center">
                                                <AlertTriangle className="w-12 h-12 text-red-500" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Verification Failed</h2>
                                            <p className="text-red-600 font-medium mb-8">
                                                {result.error || "This serial number could not be found in the registry."}
                                            </p>
                                            <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm max-w-md mx-auto">
                                                If you believe this is an error, please contact support or check the serial number for typos.
                                            </div>
                                        </>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </MotionWrapper>

            <div className="mt-auto py-6 text-center text-slate-400 text-sm">
                Secured by A-Capp Protocol • Immutable Ledger Technology
            </div>
        </div >
    );
}
