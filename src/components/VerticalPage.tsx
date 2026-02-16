'use client';

import { useState } from 'react';
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

  return (
    <ThemeProvider theme={vertical.theme}>
      <VerticalNav vertical={vertical} onOpenVoice={vertical.features?.voiceModal ? () => setVoiceOpen(true) : undefined} />
      <main style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <SectionRenderer sections={sections} vertical={vertical} testimonials={testimonials} />
      </main>
      <VerticalFooter vertical={vertical} />
      {vertical.features?.voiceModal && (
        <VoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} vertical={vertical} />
      )}
    </ThemeProvider>
  );
}
