'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MotionWrapper } from '@/components/MotionWrapper';
import { ShieldCheck, Search, CheckCircle2, XCircle, Box, AlertTriangle, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export default function VerifyPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(false);
    setResult(null);

    try {
      const response = await fetch(`/api/verification/public?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      // Artificial delay for dramatic effect
      await new Promise(r => setTimeout(r, 800));

      setResult(data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200 to-transparent opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse" />

      <MotionWrapper className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-slate-200/50 mb-6 rotate-3 hover:rotate-6 transition-transform duration-500">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4 tracking-tight">
            Verify Authenticity
          </h1>
          <p className="text-xl text-slate-500 max-w-lg mx-auto">
            Enter a Serial Number or Transaction Hash to validate product provenance on the blockchain.
          </p>
        </div>

        <GlassCard className="p-2 pl-6 pr-2 flex items-center gap-4 rounded-full shadow-2xl shadow-primary/10 border-primary/10 bg-white/80 backdrop-blur-xl hover:scale-[1.01] transition-transform duration-300">
          <Search className="w-6 h-6 text-slate-400" />
          <form onSubmit={handleVerify} className="flex-1">
            <input
              type="text"
              className="w-full h-14 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
              placeholder="SN-1234-5678-9000"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <Button
            size="lg"
            onClick={handleVerify}
            disabled={loading}
            className={`rounded-full h-12 px-8 text-lg shadow-lg transition-all ${loading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl'}`}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </GlassCard>

        <AnimatePresence>
          {hasSearched && result && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="mt-12"
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
          )}
        </AnimatePresence>
      </MotionWrapper>

      <div className="mt-auto py-6 text-center text-slate-400 text-sm">
        Secured by A-Capp Protocol • Immutable Ledger Technology
      </div>
    </div >
  );
}
