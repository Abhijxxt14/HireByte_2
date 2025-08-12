
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold font-headline">ATS Resume Ace</span>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
