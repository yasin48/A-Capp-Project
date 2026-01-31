'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    const result = await signUp(email, password);

    if (result.error) {
      setError(result.error.message || 'Failed to create account');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-heading font-bold text-slate-900">Create account</h1>
            <p className="text-slate-500">Start verifying products on the transparent ledger.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-lg font-medium shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-0.5"
              disabled={loading || authLoading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Already a member? </span>
            <Link href="/login" className="font-medium text-slate-900 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Content - Right Side on Desktop */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-slate-50 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-50 via-white to-slate-100" />

        <div className="relative z-10 max-w-md text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-8 animate-float">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Join the Network</h2>
          <p className="text-slate-600 mb-8">
            Connect with authenticators, brands, and customers in a unified, secure ecosystem.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="font-bold text-slate-900 text-lg">10k+</div>
              <div className="text-xs text-slate-500">Verified Products</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="font-bold text-slate-900 text-lg">100%</div>
              <div className="text-xs text-slate-500">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
