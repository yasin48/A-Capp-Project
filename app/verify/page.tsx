'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2, XCircle, Package, Calendar, Hash, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
    blockNumber: string;
    network: string;
  };
}

export default function VerifyPage() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Determine if it's a hash or product ID
      const isHash = searchValue.length === 64; // SHA-256 hash length
      const queryParam = isHash ? `hash=${searchValue}` : `productId=${searchValue}`;

      const response = await fetch(`/api/verify?${queryParam}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to verify product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Verify Product Authenticity
          </h1>
          <p className="text-xl text-slate-600">
            Enter a product serial number or certificate hash to verify authenticity on the blockchain
          </p>
        </div>

        {/* Verification Form */}
        <Card className="max-w-2xl mx-auto shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Enter Verification Details</CardTitle>
            <CardDescription className="text-base">
              You can verify using either the product serial number or certificate hash
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchValue">Serial Number or Certificate Hash</Label>
                <Input
                  id="searchValue"
                  type="text"
                  placeholder="Enter serial number or certificate hash..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  required
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Example: ABC123456 or a 64-character hash
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || !searchValue}
              >
                {loading ? 'Verifying...' : 'Verify Product'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="max-w-2xl mx-auto border-destructive mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <XCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Results */}
        {result && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Status Card */}
            <Card className={`border-2 ${result.verified ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.verified ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                  {result.verified ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <CardTitle className={`text-3xl ${result.verified ? 'text-green-700' : 'text-red-700'}`}>
                  {result.verified ? 'Product Verified ✓' : 'Not Verified'}
                </CardTitle>
                <CardDescription className={`text-base ${result.verified ? 'text-green-600' : 'text-red-600'}`}>
                  {result.verified
                    ? 'This product has been authenticated and verified on the blockchain'
                    : result.exists
                      ? 'Product found but verification failed'
                      : 'No verification record found for this product'
                  }
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Certificate Details */}
            {result.certificate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Certificate Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Product ID</Label>
                      <p className="font-mono text-sm">{result.certificate.productId}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Decision</Label>
                      <p className="font-medium capitalize">{result.certificate.decision}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Verified On</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">{formatDate(result.certificate.timestamp)}</p>
                      </div>
                    </div>
                    {result.certificate.reason && (
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Verification Notes</Label>
                        <p className="text-sm">{result.certificate.reason}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blockchain Details */}
            {result.blockchainRecord && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Blockchain Record
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Transaction Hash</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs break-all">{result.blockchainRecord.txHash}</p>
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Block Number</Label>
                        <p className="font-mono text-sm">{result.blockchainRecord.blockNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Network</Label>
                        <p className="text-sm capitalize">{result.blockchainRecord.network}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.timestamp && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-sm text-muted-foreground">
                    Blockchain timestamp: {formatDate(result.timestamp)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Info Section */}
        {!result && !error && (
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-xl">How Verification Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Enter Product Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Provide the product serial number or certificate hash
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Blockchain Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      We check the blockchain for the authentication certificate
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive instant verification status and certificate details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
