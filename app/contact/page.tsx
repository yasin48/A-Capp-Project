'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MotionWrapper } from '@/components/MotionWrapper';
import { Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise((r) => setTimeout(r, 1200));
        setSending(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50 via-slate-50 to-transparent" />
            <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl opacity-40" />

            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
                <MotionWrapper>
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-indigo-200/50 mb-6">
                            <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4 tracking-tight">
                            Get In Touch
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg mx-auto">
                            Have a question or need assistance? We're here to help.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <GlassCard className="p-6 hover:shadow-indigo-100/50">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                                        <a href="mailto:mujawaryasin48@gmail.com" className="text-primary hover:underline text-sm font-medium">
                                            mujawaryasin48@gmail.com
                                        </a>
                                        <p className="text-xs text-slate-400 mt-1">For general inquiries & support</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6 hover:shadow-indigo-100/50">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Response Time</h3>
                                        <p className="text-sm text-slate-500">We typically respond within <span className="font-semibold text-slate-700">24 hours</span></p>
                                        <p className="text-xs text-slate-400 mt-1">Monday – Friday, 9AM – 6PM</p>
                                    </div>
                                </div>
                            </GlassCard>

                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-200/50">
                                <h3 className="font-semibold mb-2 text-lg">Verification Issue?</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed">
                                    If you're having trouble verifying a product, please include the serial number in your message so we can assist you faster.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <GlassCard className="p-8 md:p-10">
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-green-50 mx-auto mb-6 flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                                        <p className="text-slate-500 mb-6">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                        <Button
                                            onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' }); }}
                                            variant="outline"
                                            className="rounded-full"
                                        >
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                                            >
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Technical Support">Technical Support</option>
                                                <option value="Verification Issue">Verification Issue</option>
                                                <option value="Partnership">Partnership</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us how we can help..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={sending}
                                            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                        >
                                            {sending ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </GlassCard>
                        </div>
                    </div>
                </MotionWrapper>
            </div>
        </div>
    );
}
