
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);
  

  if (loading || user) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <LoadingSpinner size={64}/>
            <p className="text-muted-foreground mt-4">Loading session...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold font-headline">HireByte</span>
        </Link>
      </div>
      <div className="z-10 flex flex-col items-center text-center mb-12">
        <div className="animate-float">
          <FileText className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mt-6">Welcome to HireByte</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Sign in to build, score, and optimize your resume for your dream job.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
