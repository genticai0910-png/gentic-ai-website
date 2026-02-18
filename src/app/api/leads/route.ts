import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { supabase } from '@/libs/Supabase';

const leadInput = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  company: z.string().optional(),
  message: z.string().optional(),
  verticalSlug: z.string().min(1),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  customFields: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadInput.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const { verticalSlug, customFields, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, ...data } = parsed.data;

    // Look up vertical ID
    const { data: vertical } = await supabase
      .from('verticals')
      .select('id')
      .eq('slug', verticalSlug)
      .single();

    if (!vertical) {
      return NextResponse.json({ ok: false, error: 'Unknown vertical' }, { status: 400 });
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        ...data,
        vertical_id: vertical.id,
        vertical_slug: verticalSlug,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        custom_fields: customFields ?? {},
      })
      .select('id')
      .single();

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json({ ok: false, error: 'Failed to save lead' }, { status: 500 });
    }

    // Fire n8n webhook (non-blocking)
    // Map page-factory fields to n8n Gentic Lead Pipeline expected shape
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nUrl) {
      fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.N8N_WEBHOOK_SECRET ? { 'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify({
          contactName: data.name,
          phone: data.phone,
          email: data.email,
          businessName: data.company ?? '',
          businessType: customFields?.businessType ?? 'other',
          matchedTier: 'growth',
          currentLeadVolume: Number(customFields?.monthlyLeads) || 0,
          teamSize: 1,
          markets: [],
          painPoints: [],
          appointmentPreference: 'scheduled',
          source: `page-factory:${verticalSlug}`,
          leadId: lead.id,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
        }),
      }).catch(() => { /* non-blocking */ });
    }

    // Fire social lead capture webhook when UTM indicates social traffic
    const socialLeadUrl = process.env.N8N_SOCIAL_LEAD_WEBHOOK_URL;
    if (socialLeadUrl && (utmMedium === 'social' || ['twitter', 'linkedin', 'instagram', 'facebook'].includes(utmSource ?? ''))) {
      fetch(socialLeadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company ?? '',
          vertical: verticalSlug,
          source_platform: utmSource ?? 'organic',
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          lead_id: lead.id,
        }),
      }).catch(() => { /* non-blocking */ });
    }

    return NextResponse.json({ ok: true, data: { id: lead.id } }, { status: 201 });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
