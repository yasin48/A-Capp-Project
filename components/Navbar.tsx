'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, LayoutDashboard, Package, ShieldCheck, Menu, X, MessageSquare } from 'lucide-react';
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    console.log('Navbar: Logout clicked');
    await signOut();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const NavLink = ({ href, children, icon: Icon, className }: { href: string; children: React.ReactNode; icon?: any; className?: string }) => {
    const isActive = pathname === href;
    return (
      <Link href={href}>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-slate-600 hover:text-primary hover:bg-slate-50",
          className
        )}>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </div>
      </Link>
    );
  };

  const MobileNavLink = ({ href, children, icon: Icon, onClick }: { href: string; children: React.ReactNode; icon?: any; onClick?: () => void }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} onClick={onClick}>
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-700 hover:bg-slate-50"
        )}>
          {Icon && <Icon className="w-5 h-5" />}
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
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink href="/verify" icon={ShieldCheck}>Verify</NavLink>
              <NavLink href="/contact" icon={MessageSquare}>Contact</NavLink>

              {user && (
                <>
                  <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                  <NavLink href="/submit" icon={Package}>Submit</NavLink>
                  {role === 'authenticator' || role === 'admin' ? (
                    <NavLink href="/authenticator" icon={Shield}>Authenticator</NavLink>
                  ) : null}
                  {role === 'admin' && (
                    <NavLink href="/admin" icon={Shield} className="text-red-600 hover:text-red-700 hover:bg-red-50">Admin</NavLink>
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
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel - slides in from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  <MobileNavLink href="/verify" icon={ShieldCheck} onClick={() => setMobileMenuOpen(false)}>
                    Verify Product
                  </MobileNavLink>
                  <MobileNavLink href="/contact" icon={MessageSquare} onClick={() => setMobileMenuOpen(false)}>
                    Contact Us
                  </MobileNavLink>

                  {user && (
                    <>
                      <MobileNavLink href="/dashboard" icon={LayoutDashboard} onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </MobileNavLink>
                      <MobileNavLink href="/submit" icon={Package} onClick={() => setMobileMenuOpen(false)}>
                        Submit Product
                      </MobileNavLink>
                      {(role === 'authenticator' || role === 'admin') && (
                        <MobileNavLink href="/authenticator" icon={Shield} onClick={() => setMobileMenuOpen(false)}>
                          Authenticator
                        </MobileNavLink>
                      )}
                      {role === 'admin' && (
                        <MobileNavLink href="/admin" icon={Shield} onClick={() => setMobileMenuOpen(false)}>
                          Admin Panel
                        </MobileNavLink>
                      )}
                    </>
                  )}
                </nav>

                {/* Footer / Auth */}
                <div className="p-6 border-t border-slate-100">
                  {loading ? (
                    <div className="flex justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
                    </div>
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="text-sm text-slate-500 text-center">
                        Signed in as <span className="font-medium text-slate-700">{user.email?.split('@')[0]}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full rounded-full text-destructive border-destructive/20 hover:bg-destructive/5"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  );
}
