'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Vertical } from '@/types/Vertical';

interface VerticalNavProps {
  vertical: Vertical;
  onOpenVoice?: () => void;
}

export function VerticalNav({ vertical, onOpenVoice }: VerticalNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showVoiceButton = vertical.features?.voiceModal;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
            {vertical.brandName}
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#platform" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
              Platform
            </a>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
              Pricing
            </a>
            {showVoiceButton && onOpenVoice ? (
              <button
                onClick={onOpenVoice}
                className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-accent)', boxShadow: `0 2px 12px var(--color-accent-glow)` }}
              >
                Talk to AI
              </button>
            ) : (
              <a
                href="#contact"
                className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-accent)', boxShadow: `0 2px 12px var(--color-accent-glow)` }}
              >
                Get Started
              </a>
            )}
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden">
            {showVoiceButton && onOpenVoice ? (
              <button
                onClick={onOpenVoice}
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--color-accent)', boxShadow: `0 2px 12px var(--color-accent-glow)` }}
              >
                Talk to AI
              </button>
            ) : (
              <a
                href="#contact"
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Get Started
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
