import type { Metadata } from "next"
import "./globals.css"
import Footer from "@/components/footer"
import ErrorBoundary from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthLayout } from "@/components/auth-layout"
import { AuthProvider } from "@/lib/contexts/AuthContext"
import ClickStars from "@/components/ClickStars"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Helpers - Management System",
  description: "Complete service management platform for customers, helpers, and administrators",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        )}
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
        <ThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              <AuthLayout>
                <main className="flex-1">{children}</main>
                <Footer />
              </AuthLayout>
              <ClickStars />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
