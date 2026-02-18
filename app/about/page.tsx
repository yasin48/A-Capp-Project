'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { MotionWrapper } from '@/components/MotionWrapper';
import { Shield, ShieldCheck, Link as LinkIcon, Lock, Lightbulb, Eye, ArrowRight, Fingerprint, Search, FileCheck, CheckCircle2, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const values = [
    { icon: ShieldCheck, label: 'Trust', description: 'Every product is verified by certified experts before authentication.', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Eye, label: 'Transparency', description: 'All decisions are publicly visible and permanently stored on-chain.', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Lock, label: 'Security', description: 'Blockchain-backed records that cannot be altered or deleted.', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Lightbulb, label: 'Innovation', description: 'Cutting-edge technology made simple for everyday consumers.', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const steps = [
    { number: '01', icon: Fingerprint, title: 'Register Your Product', description: 'Submit your luxury product with its serial number and supporting photos.' },
    { number: '02', icon: Search, title: 'Expert Verification', description: 'Our verified authenticators analyze the product against known markers.' },
    { number: '03', icon: FileCheck, title: 'Decision Recorded', description: 'The authentication decision—authentic or not—is finalized.' },
    { number: '04', icon: Database, title: 'Stored on Blockchain', description: 'The result is permanently recorded on the Polygon blockchain.' },
    { number: '05', icon: CheckCircle2, title: 'Instant Verification', description: 'Anyone can verify authenticity by scanning the serial number.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50 via-slate-50 to-transparent" />
            <div className="absolute top-60 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-40 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-40" />

            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
                <MotionWrapper>
                    {/* Hero Section */}
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-indigo-200/50 mb-6 rotate-3">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                            Bringing Trust to{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Luxury Authentication
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                            A-Capp Protocol combines expert verification with blockchain technology to create an immutable record of product authenticity—protecting consumers from counterfeits.
                        </p>
                    </div>

                    {/* Mission Statement */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-600 via-primary to-purple-700 shadow-2xl shadow-indigo-200/50 overflow-hidden">
                            <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                            <div className="relative">
                                <h2 className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-3">Our Mission</h2>
                                <p className="text-2xl md:text-3xl font-heading font-bold text-white leading-snug">
                                    To make product authentication accessible, transparent, and tamper-proof—so every consumer can shop with confidence.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="max-w-5xl mx-auto mb-24">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">How It Works</h2>
                            <p className="text-lg text-slate-500">From submission to blockchain—in five simple steps.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassCard className="p-5 text-center h-full relative group">
                                        <div className="text-xs font-bold text-primary/40 mb-3">{step.number}</div>
                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                            <step.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-2">{step.title}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Why Blockchain */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Why Blockchain?</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                Traditional verification certificates can be forged, lost, or altered. Blockchain changes that.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassCard className="p-7">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <LinkIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Immutable Records</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            Once a verification is recorded on the Polygon blockchain, it cannot be modified, deleted, or tampered with by anyone.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-7">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                        <Eye className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Public Transparency</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            Every transaction is publicly visible on PolygonScan. Anyone can independently verify the data—no trust required.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-7">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <Lock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Decentralized Security</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            No single entity controls the data. The blockchain is maintained by thousands of nodes worldwide.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-7">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Fingerprint className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Unique Digital Fingerprint</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            Each product receives a cryptographic hash—a unique digital fingerprint linking it to its verification record forever.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Our Values */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Our Values</h2>
                            <p className="text-lg text-slate-500">What drives everything we build.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, i) => (
                                <motion.div
                                    key={value.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassCard className="p-6 text-center h-full">
                                        <div className={`w-14 h-14 rounded-2xl ${value.bg} mx-auto mb-4 flex items-center justify-center`}>
                                            <value.icon className={`w-7 h-7 ${value.color}`} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-2">{value.label}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <GlassCard className="inline-block p-8 md:p-12 max-w-xl mx-auto">
                            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">Ready to Verify?</h2>
                            <p className="text-slate-500 mb-6">Check the authenticity of any registered product in seconds.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/verify">
                                    <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                                        Verify a Product
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" className="rounded-full px-8 h-12 text-base">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </GlassCard>
                    </div>
                </MotionWrapper>
            </div>
        </div>
    );
}
