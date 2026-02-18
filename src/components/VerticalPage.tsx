'use client';

import { useEffect, useState } from 'react';
import type { Vertical } from '@/types/Vertical';
import type { Section } from '@/types/Section';
import { ThemeProvider } from './ThemeProvider';
import { VerticalNav } from './VerticalNav';
import { VerticalFooter } from './VerticalFooter';
import { SectionRenderer } from './SectionRenderer';
import { VoiceModal } from './voice/VoiceModal';

interface VerticalPageProps {
  vertical: Vertical;
  sections: Section[];
  testimonials: Array<{ name: string; role: string | null; quote: string; rating: number | null; resultMetric: string | null }>;
}

export function VerticalPage({ vertical, sections, testimonials }: VerticalPageProps) {
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Persist UTM params to localStorage so they survive page navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const hasUtm = utmKeys.some(k => params.has(k));
    if (hasUtm) {
      const utmData: Record<string, string> = {};
      for (const key of utmKeys) {
        const val = params.get(key);
        if (val) utmData[key] = val;
      }
      utmData.utm_landing_vertical = vertical.slug;
      utmData.utm_captured_at = new Date().toISOString();
      localStorage.setItem('clue_utm', JSON.stringify(utmData));
    }
  }, [vertical.slug]);

  return (
    <ThemeProvider theme={vertical.theme}>
      <VerticalNav vertical={vertical} onOpenVoice={vertical.features?.voiceModal ? () => setVoiceOpen(true) : undefined} />
      <main style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <SectionRenderer sections={sections} vertical={vertical} testimonials={testimonials} onOpenVoice={vertical.features?.voiceModal ? () => setVoiceOpen(true) : undefined} />
      </main>
      <VerticalFooter vertical={vertical} />
      {vertical.features?.voiceModal && (
        <VoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} vertical={vertical} />
      )}
    </ThemeProvider>
  );
}
