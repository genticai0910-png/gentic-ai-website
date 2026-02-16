'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { HeroContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface HeroSectionProps {
  content: HeroContent;
  vertical: Vertical;
}

export default function HeroSection({ content, vertical }: HeroSectionProps) {
  const words = content.headlineWords ?? content.headline.split(' ');
  const rotating = content.rotatingWords ?? [];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    if (rotating.length === 0) return;
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotating.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotating.length]);

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
      <div className="blob blob-purple absolute -top-20 -right-40" style={{ width: 600, height: 600 }} />
      <div className="blob blob-blue absolute top-1/3 -left-32" style={{ width: 500, height: 500 }} />
      <div className="blob blob-pink absolute -bottom-20 right-1/4" style={{ width: 450, height: 450 }} />

      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-[80px] lg:leading-[1.05]" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="mr-[0.3em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {rotating.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="mb-6 text-2xl font-light sm:text-3xl lg:text-[48px] lg:leading-tight"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {content.subheadline.split('{rotating}')[0]}
            <span className="relative inline-block h-[1.2em] w-[280px] overflow-hidden align-bottom sm:w-[360px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotating[currentWord]}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute left-0 font-medium"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {rotating[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
            {content.subheadline.split('{rotating}')[1] ?? ''}
          </motion.div>
        )}

        {!rotating.length && content.subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6 text-2xl font-light sm:text-3xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {content.subheadline}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto mb-12 max-w-[640px] text-base leading-relaxed sm:text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
        >
          <a
            href={content.primaryCta.action}
            className="rounded-full px-10 py-4 text-lg font-semibold text-white transition-all hover:scale-105 active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--color-accent)',
              boxShadow: `0 4px 24px var(--color-accent-glow)`,
            }}
          >
            {content.primaryCta.text}
          </a>
          {content.secondaryCta && (
            <a
              href={content.secondaryCta.href}
              className="group inline-flex items-center gap-1.5 text-base font-medium transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {content.secondaryCta.text}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
