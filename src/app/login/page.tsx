
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


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
             <div className="flex items-center space-x-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <p className="text-muted-foreground mt-4">Redirecting...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold font-headline">ATS Resume Ace</span>
        </Link>
      </div>
      <div className="z-10 flex flex-col items-center text-center mb-12">
        <div className="animate-float">
          <FileText className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mt-6">Welcome to ATS Resume Ace</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Sign in to build, score, and optimize your resume for your dream job.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
