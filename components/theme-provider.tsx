"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define permitted attribute values
type Attribute = 'class' | 'data-theme' | 'data-mode';

// Define the ThemeProviderProps type to avoid the dependency on next-themes/dist/types
type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  forcedTheme?: string;
  [key: string]: any;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="cyberpunk"
      forcedTheme="cyberpunk"
      enableSystem={false} 
      disableTransitionOnChange 
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 