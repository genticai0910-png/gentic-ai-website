'use client';

import dynamic from 'next/dynamic';
import type { Section, SectionType } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

const sectionComponents: Record<SectionType, React.ComponentType<{ content: any; vertical: Vertical; testimonials?: any[] }>> = {
  hero: dynamic(() => import('./sections/HeroSection')),
  stats_bar: dynamic(() => import('./sections/StatsBarSection')),
  process_steps: dynamic(() => import('./sections/ProcessStepsSection')),
  pricing: dynamic(() => import('./sections/PricingSection')),
  cta_banner: dynamic(() => import('./sections/CtaBannerSection')),
  social_proof: dynamic(() => import('./sections/SocialProofSection')),
  faq: dynamic(() => import('./sections/FaqSection')),
  features: dynamic(() => import('./sections/FeaturesSection')),
  problem: dynamic(() => import('./sections/ProblemSection')),
  solution: dynamic(() => import('./sections/SolutionSection')),
  comparison: dynamic(() => import('./sections/ComparisonSection')),
  video_embed: dynamic(() => import('./sections/VideoEmbedSection')),
  authority: dynamic(() => import('./sections/AuthoritySection')),
};

interface SectionRendererProps {
  sections: Section[];
  vertical: Vertical;
  testimonials?: Array<{ name: string; role: string | null; quote: string; rating: number | null; resultMetric: string | null }>;
}

export function SectionRenderer({ sections, vertical, testimonials }: SectionRendererProps) {
  return (
    <>
      {sections
        .filter(s => s.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(section => {
          const Component = sectionComponents[section.sectionType];
          if (!Component) return null;
          return (
            <Component
              key={section.id}
              content={section.content}
              vertical={vertical}
              testimonials={section.sectionType === 'social_proof' ? testimonials : undefined}
            />
          );
        })}
    </>
  );
}
