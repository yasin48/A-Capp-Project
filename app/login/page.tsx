'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh(); // Ensure auth state updates
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-heading font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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
              placeholder="name@company.com"
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-lg bg-primary hover:bg-primary-600 text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
          disabled={loading || authLoading}
        >
          {loading ? 'Signing in...' : 'Sign in to Account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-slate-500">Don't have an account? </span>
        <Link href="/register" className="font-medium text-primary hover:underline">
          Get started
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Visual Content - Hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-2xl font-heading font-bold">A-Capp</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <blockquote className="text-2xl font-light leading-relaxed">
            "I finally feel safe buying pre-owned luxury bags. The verification process was smooth and the certificate adds real value."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white to-slate-300" />
            <div>
              <div className="font-medium">Jessica K.</div>
              <div className="text-slate-400 text-sm">Bag Collector</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © 2024 A-Capp. Secured by Blockchain.
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
