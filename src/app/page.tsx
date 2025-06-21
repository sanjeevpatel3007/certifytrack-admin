// app/page.tsx
'use client'

import { useAuth } from '@/components/common/auth-provider';
import AuthModal from '@/components/layout/auth-modal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to CertifyTrack Admin
        </h1>
        
        <p className="text-center mb-8">
          Please sign in to access the admin dashboard.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </main>
  );
}
