'use client';

import { motion } from 'framer-motion';
import type { SocialProofContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface SocialProofSectionProps {
  content: SocialProofContent;
  vertical: Vertical;
  testimonials?: Array<{ name: string; role: string | null; quote: string; rating: number | null; resultMetric: string | null }>;
}

export default function SocialProofSection({ content, testimonials = [] }: SocialProofSectionProps) {
  return (
    <section className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-5xl">
        {content.badge && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-sm font-medium tracking-wide uppercase"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {content.badge}
          </motion.p>
        )}

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass p-8"
            >
              {item.resultMetric && (
                <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{item.resultMetric}</p>
              )}
              <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.name}</p>
                {item.role && <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{item.role}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
