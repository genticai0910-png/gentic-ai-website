'use client';

import { motion } from 'framer-motion';
import type { CtaBannerContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface CtaBannerSectionProps {
  content: CtaBannerContent;
  vertical: Vertical;
}

export default function CtaBannerSection({ content }: CtaBannerSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-8 lg:py-36">
      {content.darkBg && <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1f] to-[#0a0a0b]" />}
      <div className="blob blob-purple absolute top-1/2 left-1/4 -translate-y-1/2 opacity-20" style={{ width: 500, height: 500 }} />
      <div className="blob blob-blue absolute top-1/3 right-1/4 opacity-15" style={{ width: 400, height: 400 }} />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]"
          style={{ color: content.darkBg ? '#ffffff' : 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          {content.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 text-lg"
          style={{ color: content.darkBg ? 'rgba(255,255,255,0.7)' : 'var(--color-text-secondary)' }}
        >
          {content.description}
        </motion.p>

        <motion.a
          href={content.ctaAction}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block rounded-full px-12 py-4 text-lg font-semibold text-white transition-all hover:scale-105 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-accent)', boxShadow: `0 4px 32px var(--color-accent-glow)` }}
        >
          {content.ctaText}
        </motion.a>
      </div>
    </section>
  );
}
