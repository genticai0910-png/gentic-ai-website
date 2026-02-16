'use client';

import { motion } from 'framer-motion';
import type { VideoEmbedContent } from '@/types/Section';
import type { Vertical } from '@/types/Vertical';

interface VideoEmbedSectionProps {
  content: VideoEmbedContent;
  vertical: Vertical;
}

function getEmbedUrl(url: string, provider: string): string {
  if (provider === 'youtube') {
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }
  if (provider === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  }
  return url;
}

export default function VideoEmbedSection({ content }: VideoEmbedSectionProps) {
  return (
    <section className="px-6 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-4xl">
        {content.title && (
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {content.title}
          </motion.h2>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative aspect-video overflow-hidden rounded-2xl">
          <iframe
            src={getEmbedUrl(content.videoUrl, content.provider)}
            title={content.title ?? 'Video'}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
