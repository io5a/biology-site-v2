import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { themeConfig } from "@/config/theme"

// Configure your font here
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BioART",
  description: "Site-ul nostru de biologie",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" data-theme={themeConfig.theme} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme={themeConfig.theme}
          forcedTheme={themeConfig.theme}
          enableSystem={false}
          themes={["default", "blue", "purple", "orange", "red", "pink", "cyan"]}
        >
          <Navigation />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
