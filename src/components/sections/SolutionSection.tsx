'use client';

import { motion } from 'framer-motion';
import type { SolutionContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface SolutionSectionProps {
  content: SolutionContent;
  vertical: Vertical;
}

export default function SolutionSection({ content }: SolutionSectionProps) {
  return (
    <section className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-5xl">
        {content.subtitle && (
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-4 text-center text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--color-accent)' }}>
            {content.subtitle}
          </motion.p>
        )}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          {content.title}
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.benefits.map((benefit, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass p-8">
              <h3 className="mb-2 text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{benefit.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
