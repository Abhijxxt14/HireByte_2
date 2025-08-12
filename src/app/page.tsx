
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ResumePage from './resume-page';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SplashScreen } from '@/components/splash-screen';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 5 seconds then fade out
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Do not check for user until splash is hidden
    if (showSplash) return;

    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router, showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (authLoading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <LoadingSpinner size={64} />
            <p className="text-muted-foreground mt-4">Loading user session...</p>
        </div>
    );
  }
  
  return (
    <main className="min-h-screen">
      <ResumePage />
    </main>
  );
}
