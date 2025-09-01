'use client'

import { ReactNode } from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

interface Props extends ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={true}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
