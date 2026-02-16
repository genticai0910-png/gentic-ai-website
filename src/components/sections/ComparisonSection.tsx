'use client';

import { motion } from 'framer-motion';
import type { ComparisonContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface ComparisonSectionProps {
  content: ComparisonContent;
  vertical: Vertical;
}

export default function ComparisonSection({ content }: ComparisonSectionProps) {
  return (
    <section className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          {content.title}
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <th className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Feature</th>
                <th className="px-6 py-4 text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{content.headers[0]}</th>
                <th className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{content.headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row, i) => (
                <tr key={i} className="border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <td className="px-6 py-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.feature}</td>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{row.us}</td>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{row.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
