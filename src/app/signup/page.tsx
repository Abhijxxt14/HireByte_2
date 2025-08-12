
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SignUpForm } from '@/components/auth/signup-form';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SignUpPage() {
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold font-headline">HireByte</span>
        </Link>
      </div>
      <SignUpForm />
    </div>
  );
}
