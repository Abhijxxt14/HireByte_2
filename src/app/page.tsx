
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ResumePage from './resume-page';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
