import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get Help with Resume Building | HireByte',
  description: 'Contact HireByte for support with resume building, ATS scoring, and career advice. Get in touch with our team for personalized assistance.',
  keywords: [
    'contact hirebyte',
    'resume help',
    'customer support',
    'career assistance',
    'resume builder support'
  ],
  openGraph: {
    title: 'Contact HireByte - Resume Building Support',
    description: 'Get help with resume building and ATS optimization. Contact our team for personalized career assistance.',
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}