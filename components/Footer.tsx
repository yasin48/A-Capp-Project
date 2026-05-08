'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

const footerLinks = [
    {
        title: 'Product',
        links: [
            { label: 'Verify Product', href: '/verify' },
            { label: 'How It Works', href: '/about#how-it-works' },
            { label: 'Submit Product', href: '/submit' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },

];

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-shadow">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Blockchain-powered product authentication. Trust, transparency, and security for every consumer.
                        </p>
                    </div>

                    {/* Link Columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} A-Capp Protocol. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500">
                        Secured by Polygon Blockchain &bull; Immutable Ledger Technology
                    </p>
                </div>
            </div>
        </footer>
    );
}
