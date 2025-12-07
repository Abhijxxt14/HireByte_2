
"use client";

import { useState } from 'react';
import { Footer } from '@/components/footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareHeart, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    const recipientEmail = 'jeebankrushnasahu1@gmail.com';
    const emailSubject = `Feedback from ${name} (${email}) via HireByte: ${subject}`;
    const body = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
    const mailtoHref = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoHref;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto p-4 md:p-8 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-3xl sm:text-5xl font-bold font-headline tracking-tight">HireByte</h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl shadow-primary/10">
          <CardHeader className="text-center">
            <MessageSquareHeart className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-4">Share Your Feedback</CardTitle>
            <CardDescription>
              We'd love to hear about your experience with HireByte. Fill out the form below to send us your thoughts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                 <Select onValueChange={setSubject} value={subject}>
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="General Feedback">General Feedback</SelectItem>
                        <SelectItem value="Bug Report">Bug Report</SelectItem>
                        <SelectItem value="Feature Request">Feature Request</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Your message here..." 
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button onClick={handleSendMessage} className="w-full" disabled={!name || !email || !subject || !message}>
                  Send Feedback
              </Button>
               <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
