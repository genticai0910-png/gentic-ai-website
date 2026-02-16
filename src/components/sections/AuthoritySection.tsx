'use client';

import { motion } from 'framer-motion';
import type { AuthorityContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface AuthoritySectionProps {
  content: AuthorityContent;
  vertical: Vertical;
}

export default function AuthoritySection({ content }: AuthoritySectionProps) {
  return (
    <section className="px-6 py-28 lg:px-8 lg:py-36" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="mx-auto max-w-3xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          {content.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-lg max-w-none"
          style={{ color: 'var(--color-text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: content.body }}
        />
      </div>
    </section>
  );
}
