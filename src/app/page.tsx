
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ResumePage from './resume-page';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SplashScreen } from '@/components/splash-screen';

const SPLASH_SEEN_KEY = 'firebase-studio-splash-seen';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check session storage to see if splash has been shown
    const splashSeen = sessionStorage.getItem(SPLASH_SEEN_KEY);
    if (splashSeen) {
      setShowSplash(false);
    } else {
      // Show splash for 5 seconds then fade out
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

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
