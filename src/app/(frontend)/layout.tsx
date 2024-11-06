import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './globals.css'
import { draftMode } from 'next/headers'
import ScrollToTop from '@/components/ScrollToTop'
import { PrivacyProvider } from '@/providers/Privacy'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@/components/Analytics/GoogleTagManager'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en" suppressHydrationWarning>
      <PrivacyProvider>
        <head>
          <InitTheme />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <GoogleAnalytics />
        </head>
        <body className={`${inter.className} min-h-screen`}>
          <GoogleTagManager />
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <LivePreviewListener />

            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.waywisegtech.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@waywisetech',
  },
  alternates: {
    canonical: './',
  },
}
