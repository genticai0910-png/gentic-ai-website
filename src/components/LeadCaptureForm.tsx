'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vertical } from '@/types/Vertical';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone is required'),
  company: z.string().optional(),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  vertical: Vertical;
}

export function LeadCaptureForm({ vertical }: LeadCaptureFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setStatus('submitting');
    try {
      // Capture UTM params — check URL first, fall back to localStorage
      const params = new URLSearchParams(window.location.search);
      let stored: Record<string, string> = {};
      try { stored = JSON.parse(localStorage.getItem('clue_utm') || '{}'); } catch { /* ignore */ }
      const utmData = {
        utmSource: params.get('utm_source') ?? stored.utm_source ?? undefined,
        utmMedium: params.get('utm_medium') ?? stored.utm_medium ?? undefined,
        utmCampaign: params.get('utm_campaign') ?? stored.utm_campaign ?? undefined,
        utmContent: params.get('utm_content') ?? stored.utm_content ?? undefined,
        utmTerm: params.get('utm_term') ?? stored.utm_term ?? undefined,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...utmData,
          verticalSlug: vertical.slug,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div id="contact" className="glass p-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `color-mix(in srgb, var(--color-accent) 10%, transparent)` }}>
          <svg className="h-6 w-6" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Thank you!</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form id="contact" onSubmit={handleSubmit(onSubmit)} className="glass space-y-4 p-8">
      <h3 className="mb-6 text-xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
        Get Started with {vertical.brandName}
      </h3>

      <div>
        <input
          {...register('name')}
          placeholder="Full Name *"
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{ borderColor: 'var(--color-text-tertiary)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email *"
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{ borderColor: 'var(--color-text-tertiary)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('phone')}
          type="tel"
          placeholder="Phone *"
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{ borderColor: 'var(--color-text-tertiary)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <input
          {...register('company')}
          placeholder="Company (optional)"
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{ borderColor: 'var(--color-text-tertiary)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Tell us about your needs (optional)"
          rows={3}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{ borderColor: 'var(--color-text-tertiary)', color: 'var(--color-text-primary)', '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-full py-3.5 text-base font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
        style={{ backgroundColor: 'var(--color-accent)', boxShadow: `0 4px 16px var(--color-accent-glow)` }}
      >
        {status === 'submitting' ? 'Submitting...' : 'Get Started'}
      </button>
    </form>
  );
}
