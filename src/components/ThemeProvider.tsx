'use client';

import { useEffect } from 'react';
import type { VerticalTheme } from '@/types/Vertical';

interface ThemeProviderProps {
  theme: VerticalTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', theme.colorAccent);
    root.style.setProperty('--color-accent-hover', theme.colorAccentHover);
    root.style.setProperty('--color-accent-glow', theme.colorAccentGlow);
    root.style.setProperty('--color-bg-primary', theme.colorBgPrimary);
    root.style.setProperty('--color-bg-secondary', theme.colorBgSecondary);
    root.style.setProperty('--color-text-primary', theme.colorTextPrimary);
    root.style.setProperty('--color-text-secondary', theme.colorTextSecondary);
    root.style.setProperty('--color-text-tertiary', theme.colorTextTertiary);
    root.style.setProperty('--font-heading', theme.fontHeading);
    root.style.setProperty('--font-body', theme.fontBody);

    if (theme.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    return () => {
      root.classList.remove('dark');
    };
  }, [theme]);

  return <>{children}</>;
}
