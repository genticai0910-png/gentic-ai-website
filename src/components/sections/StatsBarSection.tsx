'use client';

import { motion } from 'framer-motion';
import type { StatsBarContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

function StatItem({ stat, isInView, index }: { stat: StatsBarContent['stats'][0]; isInView: boolean; index: number }) {
  const display = stat.isDecimal
    ? (isInView ? `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}` : `${stat.prefix ?? ''}0${stat.suffix ?? ''}`)
    : useCountUp(stat.value, isInView, 1200, stat.prefix ?? '', stat.suffix ?? '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center px-6 py-4 sm:py-0"
    >
      <span className="stat-number mb-1 text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-accent)' }}>
        {display}
      </span>
      <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {stat.label}
      </span>
    </motion.div>
  );
}

interface StatsBarSectionProps {
  content: StatsBarContent;
  vertical: Vertical;
}

export default function StatsBarSection({ content }: StatsBarSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section className="relative px-6 lg:px-8">
      <div ref={ref} className="glass mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-gray-200/50">
          {content.stats.map((stat, i) => (
            <StatItem key={i} stat={stat} isInView={isInView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
