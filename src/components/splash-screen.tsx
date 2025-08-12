
"use client";

import React from 'react';
import { FileText } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background transition-opacity duration-500 ease-in-out">
      <div className="relative text-center">
        <div className="animate-float mb-4">
            <FileText className="h-24 w-24 text-primary" />
        </div>
        <h1 
            className="text-5xl md:text-7xl font-bold text-foreground overflow-hidden whitespace-nowrap animate-typewriter font-headline relative"
        >
          HireByte
          <span className="border-r-4 border-accent animate-blink-caret absolute right-0 top-0 h-full"></span>
        </h1>
         <div className="animate-scanline"></div>
      </div>
    </div>
  );
}
