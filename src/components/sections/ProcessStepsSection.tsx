'use client';

import { motion } from 'framer-motion';
import type { ProcessStepsContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface ProcessStepsSectionProps {
  content: ProcessStepsContent;
  vertical: Vertical;
}

export default function ProcessStepsSection({ content }: ProcessStepsSectionProps) {
  return (
    <section id="platform" className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-[48px]"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          {content.title}
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {content.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="glass p-8 sm:p-10"
            >
              <span className="mb-4 block text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
                {step.number}
              </span>
              <h3 className="mb-3 text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-text-primary)' }}>
                {step.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
