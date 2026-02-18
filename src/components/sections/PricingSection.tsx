'use client';

import { motion } from 'framer-motion';
import type { PricingContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface PricingSectionProps {
  content: PricingContent;
  vertical: Vertical;
}

export default function PricingSection({ content, vertical }: PricingSectionProps) {
  const handleCheckout = async (planName: string, priceId?: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planName, verticalSlug: vertical.slug }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.error);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <section id="pricing" className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-4xl">
        {content.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-center"
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{ backgroundColor: `color-mix(in srgb, var(--color-accent) 10%, transparent)`, color: 'var(--color-accent)' }}
            >
              {content.badge}
            </span>
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-[48px]"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          {content.title}
        </motion.h2>

        {content.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-16 text-center text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {content.description}
          </motion.p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {content.plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`glass relative p-8 sm:p-10 ${plan.popular ? 'ring-2 ring-offset-2 ring-offset-white' : ''}`}
              style={plan.popular ? { '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties : undefined}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                  Popular
                </span>
              )}

              <p className="mb-1 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{plan.description}</p>
              <h3 className="mb-6 text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-text-primary)' }}>{plan.name}</h3>

              <div className="mb-8">
                {plan.originalPrice && (
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-lg line-through" style={{ color: 'var(--color-text-tertiary)' }}>${plan.originalPrice}/mo</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Save {Math.round((1 - parseInt(plan.price.replace(',', '')) / parseInt(plan.originalPrice.replace(',', ''))) * 100)}%
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight sm:text-[56px]" style={{ color: 'var(--color-text-primary)' }}>${plan.price}</span>
                  <span className="text-base" style={{ color: 'var(--color-text-tertiary)' }}>/mo</span>
                </div>
              </div>

              <ul className="mb-10 space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-base" style={{ color: 'var(--color-text-secondary)' }}>
                    <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name, plan.priceId)}
                className={`w-full rounded-full py-3.5 text-base font-semibold transition-all ${plan.popular ? 'text-white' : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                style={plan.popular ? { backgroundColor: 'var(--color-accent)', boxShadow: `0 4px 16px var(--color-accent-glow)` } : { color: 'var(--color-text-primary)' }}
              >
                {plan.ctaText ?? 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
