
"use client";

import { Linkedin, Github, FileText, TestTube, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">HireByte</h3>
            <p className="text-sm text-muted-foreground">
              A modern ATS-friendly resume building platform that helps job seekers create optimized resumes and test their ATS compatibility.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#resume-builder" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <FileText className="h-4 w-4" />
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/#ats-testing" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <TestTube className="h-4 w-4" />
                  ATS Compatibility Test
                </Link>
              </li>
              <li>
                <Link href="/#ai-resume" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Sparkles className="h-4 w-4" />
                  AI Resume Generation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://github.com/Jeeban-2006/HireByte#readme" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/Jeeban-2006/HireByte#-getting-started" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="https://github.com/Jeeban-2006/HireByte/issues" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Issues
                </Link>
              </li>
              <li>
                <Link href="https://github.com/Jeeban-2006/HireByte#-deployment" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Deployment Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <div className="space-y-4">
              {/* Feedback Link */}
              <div>
                <Link 
                  href="/contact" 
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Send Feedback
                </Link>
              </div>
              
              {/* Jeeban Krushna Sahu */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Jeeban Krushna Sahu</p>
                <div className="flex gap-3">
                  <Link 
                    href="https://github.com/Jeeban-2006" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Jeeban's GitHub"
                  >
                    <Github className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Link>
                  <Link 
                    href="https://linkedin.com/in/jeeban-krushna-sahu-004228301" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Jeeban's LinkedIn"
                  >
                    <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Link>
                </div>
              </div>
              
              {/* Abhijeet Soren */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Abhijeet Soren</p>
                <div className="flex gap-3">
                  <Link 
                    href="https://github.com/Abhijxxt14" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Abhijeet's GitHub"
                  >
                    <Github className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Link>
                  <Link 
                    href="https://www.linkedin.com/in/abhijeet-soren-a7654b2b5/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Abhijeet's LinkedIn"
                  >
                    <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} HireByte. All rights reserved.</p>
            <p>
              Designed & Developed by{' '}
              <Link 
                href="https://linkedin.com/in/jeeban-krushna-sahu-004228301" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Jeeban Krushna Sahu
              </Link>
              {' '}&{' '}
              <Link 
                href="https://github.com/Abhijxxt14" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Abhijeet Soren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
