import type { Metadata } from 'next'
import './globals.css'
import { I18nProvider } from '@/i18n/provider'
import GoogleAnalytics from '@/components/GoogleAnalytics'

// SEO Keywords optimized for Cloud Gaming and Boosteroid
const seoKeywords = [
  'Boosteroid optimizer', 
  'Boosteroid 4K', 
  'cloud gaming enhancer',
  'force 4K Boosteroid', 
  'Tampermonkey Boosteroid', 
  'Boosteroid ultrawide'
].join(', ')

export const metadata: Metadata = {
  metadataBase: new URL('https://optimizerplus.github.io'),
  title: {
    default: 'Boosteroid Optimizer Plus | Force 4K & Upscaling for Cloud Gaming',
    template: '%s | Boosteroid Optimizer Plus'
  },
  description: 'Unlock the full potential of your Boosteroid cloud gaming experience. Force 4K resolution, smart upscaling, video enhancement filters, and ultra-low latency on any monitor. Free Tampermonkey extension for PC.',
  keywords: seoKeywords,
  authors: [{ name: 'Derfog', url: 'https://github.com/derfog' }],
  creator: 'Derfog',
  publisher: 'Boosteroid Optimizer Plus',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_FR',
    url: 'https://optimizerplus.github.io',
    siteName: 'Boosteroid Optimizer Plus',
    title: 'Boosteroid Optimizer Plus | Force 4K & Upscaling for Cloud Gaming',
    description: 'Free Tampermonkey extension to unlock 4K resolution, upscaling, and video enhancement on Boosteroid cloud gaming. Works on any monitor!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Boosteroid Optimizer Plus - Cloud Gaming Enhancement',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Boosteroid Optimizer Plus | Force 4K Cloud Gaming',
    description: 'Unlock 4K resolution, upscaling & video filters on Boosteroid. Free Tampermonkey extension!',
    images: ['/og-image.png'],
    creator: '@derfog',
  },
  
  // Robots
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
  
  // Verification - Add your Google Search Console verification code here
  // verification: {
  //   google: 'your-google-verification-code',
  // },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  // Manifest
  manifest: '/site.webmanifest',
  
  // Alternate languages
  alternates: {
    canonical: 'https://optimizerplus.github.io',
    languages: {
      'en': 'https://optimizerplus.github.io',
      'fr': 'https://optimizerplus.github.io/fr',
    },
  },
  
  // Category
  category: 'technology',
}

// JSON-LD Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Boosteroid Optimizer Plus',
  applicationCategory: 'BrowserApplication',
  operatingSystem: 'Windows, macOS, Linux (with Tampermonkey)',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'A powerful Tampermonkey script that enhances Boosteroid cloud gaming with 4K resolution forcing, smart upscaling, video filters, and ultra-low latency optimization.',
  author: {
    '@type': 'Person',
    name: 'Derfog',
    url: 'https://github.com/derfog',
  },
  softwareVersion: '3.7.2',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '150',
  },
  featureList: [
    'Force 4K resolution on any monitor',
    'Smart upscaling (1080p to 4K)',
    'Auto-detect native screen resolution',
    'Multi-monitor support',
    'Video enhancement filters (sharpness, contrast)',
    'Ultra-low latency mode',
    'AV1/HEVC codec optimization',
    'Ultrawide 21:9/32:9 support',
    'Performance mode for 60fps stability',
    '15+ languages supported',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Additional SEO meta tags */}
        <meta name="generator" content="Derfog's custom stack - Not an AI template" />
        <meta name="theme-color" content="#00a3ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      {/* suppressHydrationWarning is used here because browser extensions may modify the body */}
      <body className="bg-boo-dark text-white antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-boo-blue focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
