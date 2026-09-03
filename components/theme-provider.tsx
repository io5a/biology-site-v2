"use client"

import { useEffect, useState } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}

export function ThemeProvider({ children, defaultTheme = "system", attribute = "class" }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const savedTheme = localStorage.getItem("theme")
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const theme = savedTheme ?? (defaultTheme === "system" ? systemTheme : defaultTheme)

    root.setAttribute(attribute, theme)
    root.classList.toggle("dark", theme === "dark")
    setMounted(true)
  }, [attribute, defaultTheme])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const current = root.getAttribute(attribute) ?? "light"
    localStorage.setItem("theme", current)
  }, [attribute, mounted])

  return <>{children}</>
}
