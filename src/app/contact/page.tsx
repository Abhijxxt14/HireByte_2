
import { UserNav } from '@/components/auth/user-nav';
import { Footer } from '@/components/footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto p-4 md:p-8 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-3xl sm:text-5xl font-bold font-headline tracking-tight">HireByte</h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl shadow-primary/10">
          <CardHeader className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-4">Get in Touch</CardTitle>
            <CardDescription>
              Have a question or feedback? Fill out the form below to send us a message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* NOTE: This is a visual form only and does not send data. */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message here..." rows={6} />
              </div>
              <Button type="submit" className="w-full" disabled>Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
