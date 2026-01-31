import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'AI Shield - Enterprise Data Governance Platform',
  description: 'Prevent sensitive data exposure from unauthorized AI usage while maintaining employee productivity. Complete governance, compliance, and real-time monitoring solution.',
  keywords: ['AI governance', 'data protection', 'compliance', 'GDPR', 'HIPAA', 'data classification'],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
