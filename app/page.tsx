'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Shield, FileCheck, Database, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Product Submission',
      description: 'Submit your products with serial numbers and images for authentication verification.'
    },
    {
      icon: Shield,
      title: 'Expert Verification',
      description: 'Our authenticators carefully verify each product using advanced cross-checking methods.'
    },
    {
      icon: FileCheck,
      title: 'Digital Certificate',
      description: 'Receive a tamper-proof digital certificate upon successful authentication.'
    },
    {
      icon: Database,
      title: 'Blockchain Storage',
      description: 'Certificates are securely stored on the blockchain for permanent verification.'
    },
    {
      icon: Globe,
      title: 'Public Verification',
      description: 'Anyone can verify product authenticity using the serial number or certificate hash.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Authenticate Your Products with{' '}
            <span className="text-primary">Blockchain Technology</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Secure, transparent, and tamper-proof product authentication.
            Protect your brand and give customers confidence in every purchase.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our 5-step authentication process ensures the highest level of security and trust
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to Protect Your Products?
            </CardTitle>
            <CardDescription className="text-lg text-primary-foreground/90 mb-6">
              Join thousands of brands using blockchain authentication
            </CardDescription>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
