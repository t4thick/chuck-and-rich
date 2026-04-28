import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getPublicSiteUrl } from '@/lib/site-url'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const siteUrl = getPublicSiteUrl()
const siteName = 'Lovely Queen African Market'
const siteDescription =
  'Authentic African groceries, spices, beauty products, and household goods — delivered to your door.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'African grocery',
    'African market online',
    'African food delivery',
    'jollof rice',
    'fufu flour',
    'egusi',
    'plantain',
    'African beauty products',
    'Caribbean groceries',
    'Lovely Queen African Market',
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/logo.png'],
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
  alternates: {
    canonical: '/',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f9f9f9]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
