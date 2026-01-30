'use client';

import Link from 'next/link';

export default function Home() {
  // Middleware handles redirecting authenticated users to /dashboard
  // No need for client-side redirect logic here
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Product Authentication System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Blockchain-powered product verification and certification
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Get Started
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to your account or create a new one to start authenticating products.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full block bg-primary-600 text-white text-center px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="w-full block bg-white text-primary-600 border-2 border-primary-600 text-center px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t">
            <Link
              href="/verify"
              className="text-primary-600 hover:text-primary-700 text-sm text-center block"
            >
              Verify a product (Public) →
            </Link>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-gray-600">
              Your products are verified using blockchain technology for maximum security
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Verified Products</h3>
            <p className="text-gray-600">
              Get digital certificates for your authenticated products
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Public Verification</h3>
            <p className="text-gray-600">
              Anyone can verify product authenticity using our public verification system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
