import type { Metadata } from "next"
import "./globals.css"
import { Footer } from "@/components/footer"
import ErrorBoundary from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthLayout } from "@/components/auth-layout"
import { AuthProvider } from "@/lib/contexts/AuthContext"
import Script from "next/script"

// Disable static generation to avoid SSR issues
export const dynamic = 'force-dynamic'

// Prevent static generation of error pages
export const generateStaticParams = () => {
  return []
}

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
    <html lang="en" className="light">
      <head>
        {/* Google Tag Manager */}
        <Script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T6NX7PJS');`
          }}
        />

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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T6NX7PJS"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <div>
          <ErrorBoundary>
            <main>{children}</main>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  )
}
