import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'HireByte - AI-Powered Resume Builder & ATS Score Checker',
    template: '%s | HireByte'
  },
  description: 'Build professional resumes and check ATS compatibility with HireByte. Get instant resume scoring, AI-powered suggestions, and optimize your resume for job applications.',
  keywords: [
    'resume builder',
    'ATS checker',
    'resume optimization',
    'job application',
    'career tools',
    'resume scoring',
    'AI resume builder',
    'applicant tracking system',
    'resume templates',
    'job search tools'
  ],
  authors: [{ name: 'HireByte Team' }],
  creator: 'HireByte',
  publisher: 'HireByte',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'HireByte',
    title: 'HireByte - AI-Powered Resume Builder & ATS Score Checker',
    description: 'Build professional resumes and check ATS compatibility with HireByte. Get instant resume scoring, AI-powered suggestions, and optimize your resume for job applications.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HireByte - Resume Builder and ATS Checker'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireByte - AI-Powered Resume Builder & ATS Score Checker',
    description: 'Build professional resumes and check ATS compatibility with HireByte. Get instant resume scoring and AI-powered suggestions.',
    images: ['/og-image.jpg'],
    creator: '@hirebyte'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'HireByte',
              description: 'AI-powered resume builder and ATS compatibility checker',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              featureList: [
                'Resume Builder',
                'ATS Score Checker',
                'AI-Powered Suggestions',
                'Multiple Resume Templates',
                'Real-time Resume Scoring'
              ],
              screenshot: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hirebyte.netlify.app'}/og-image.jpg`,
              author: {
                '@type': 'Organization',
                name: 'HireByte Team'
              }
            })
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
