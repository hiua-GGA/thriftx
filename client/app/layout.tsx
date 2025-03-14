import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | ThriftX - Premium Thrift Shopping',
    default: 'ThriftX - Premium Thrift Shopping',
  },
  description: 'Discover unique, sustainable fashion at ThriftX. Shop pre-loved clothing, accessories, and more from verified vendors.',
  keywords: ['thrift', 'sustainable fashion', 'second-hand', 'pre-loved', 'vintage', 'clothing', 'accessories'],
  authors: [{ name: 'ThriftX Team' }],
  creator: 'ThriftX',
  publisher: 'ThriftX',
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://thriftx.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ThriftX - Premium Thrift Shopping',
    description: 'Discover unique, sustainable fashion at ThriftX. Shop pre-loved clothing, accessories, and more from verified vendors.',
    url: 'https://thriftx.com',
    siteName: 'ThriftX',
    images: [
      {
        url: 'https://thriftx.com/images/logo.png',
        width: 200,
        height: 60,
        alt: 'ThriftX - Premium Thrift Shopping',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThriftX - Premium Thrift Shopping',
    description: 'Discover unique, sustainable fashion at ThriftX. Shop pre-loved clothing, accessories, and more from verified vendors.',
    images: ['https://thriftx.com/images/logo.png'],
    creator: '@thriftx',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 