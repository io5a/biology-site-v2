import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { themeConfig } from "@/config/theme"
import { AuthProvider } from "@/app/context/authContext/supabase"
import { supabase } from "@/supabase-client"
import { Session } from "@supabase/supabase-js"

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
    
    <html lang="en" data-theme={themeConfig.theme} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
          >
            <AuthProvider>
              <Navigation />
              {children}
            </AuthProvider>
          </ThemeProvider>
          <Analytics />
      </body>
    </html>
  )
}
