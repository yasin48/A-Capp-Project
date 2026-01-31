'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, LayoutDashboard, Package, ShieldCheck, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, role, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: any }) => {
    const isActive = pathname === href;
    return (
      <Link href={href}>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-slate-600 hover:text-primary hover:bg-slate-50"
        )}>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </div>
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-md py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-shadow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                A-Capp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink href="/verify" icon={ShieldCheck}>Verify</NavLink>

              {user && (
                <>
                  <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                  <NavLink href="/submit" icon={Package}>Submit</NavLink>
                  {role === 'authenticator' && (
                    <NavLink href="/authenticator" icon={Shield}>Authenticator</NavLink>
                  )}
                </>
              )}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
              ) : user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <span className="text-sm font-medium text-slate-600">
                    {user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 rounded-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" className="rounded-full hover:bg-slate-100 font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  );
}
