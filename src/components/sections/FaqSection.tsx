'use client';

import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import type { FaqContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface FaqSectionProps {
  content: FaqContent;
  vertical: Vertical;
}

export default function FaqSection({ content }: FaqSectionProps) {
  return (
    <section className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          {content.title}
        </motion.h2>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {content.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Accordion.Item value={`item-${i}`} className="glass overflow-hidden">
                <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                  {item.question}
                  <svg className="h-5 w-5 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="px-6 pb-4 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.answer}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>

        {/* Schema.org FAQPage markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.items.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
