
"use client";

import { Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 w-full py-6 mt-12 border-t border-border">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center text-sm text-muted-foreground gap-x-4 gap-y-2">
        <div className="flex items-center">
          <span>Designed by Jeeban Krushna Sahu</span>
          <Link 
            href="https://linkedin.com/in/jeeban-krushna-sahu-004228301" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 p-1 rounded-full hover:bg-accent transition-colors"
            aria-label="Jeeban Krushna Sahu's LinkedIn Profile"
          >
            <Linkedin className="h-4 w-4 text-primary" />
          </Link>
        </div>
        <div className="hidden sm:block">|</div>
        <Link href="/contact" className="hover:text-primary hover:underline">
          Contact
        </Link>
      </div>
    </footer>
  );
}
