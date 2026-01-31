'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { MotionWrapper, StaggerContainer, FadeItem } from '@/components/MotionWrapper';
import { ShieldCheck, Lock, Globe, Database, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl animate-float opacity-50" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <MotionWrapper className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Blockchain-Verified Security</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              The Standard for <br />
              <span className="text-gradient">Digital Authenticity</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Secure your brand and empower your customers with the world's most advanced blockchain-based product verification protocol.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                  Start Verifying
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-white transition-all hover:-translate-y-1">
                  Check a Serial Number
                </Button>
              </Link>
            </div>
          </MotionWrapper>

          {/* Hero Visual */}
          <MotionWrapper delay={0.3} className="mt-20 relative lg:-mx-20">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <GlassCard className="p-8 transform md:translate-y-12">
                <Lock className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Immutable Ledger</h3>
                <p className="text-slate-500">Every verification is cryptographically signed and stored on-chain forever.</p>
              </GlassCard>
              <GlassCard className="p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-primary/25">
                <ShieldCheck className="w-12 h-12 text-white/90 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Instant Verification</h3>
                <p className="text-white/80">Real-time fraud detection using advanced matching algorithms.</p>
              </GlassCard>
              <GlassCard className="p-8 transform md:translate-y-12">
                <Globe className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Global Access</h3>
                <p className="text-slate-500">Accessible from anywhere in the world, ensuring universal trust.</p>
              </GlassCard>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Architecture of Trust</h2>
            <p className="text-slate-500 text-lg">Built for brands that demand perfection. Our platform provides end-to-end security for your entire supply chain.</p>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Database, title: "Decentralized", desc: "No single point of failure." },
              { icon: Zap, title: "Lightning Fast", desc: "Sub-second verification times." },
              { icon: CheckCircle2, title: "Tamper Proof", desc: "Impossible to forge records." },
              { icon: Lock, title: "Bank-Grade", desc: "AES-256 encryption standard." }
            ].map((f, i) => (
              <FadeItem key={i}>
                <div className="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              </FadeItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 px-6 py-20 text-center">
            {/* Abstract Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-accent-900/50" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to secure your future?
              </h2>
              <p className="text-slate-300 text-xl mb-10 font-light">
                Join the network of verified authenticators and brands protecting millions in value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-8 h-14 text-lg">
                    Create Account
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button variant="outline" size="lg" className="rounded-full border-slate-700 text-white hover:bg-slate-800 hover:text-white px-8 h-14 text-lg bg-transparent">
                    Verify Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>© {new Date().getFullYear()} A-Capp Protocol. Built with precision.</p>
        </div>
      </footer>
    </div>
  );
}
