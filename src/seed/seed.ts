import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from '../models/Schema';

const {
  verticalsSchema,
  sectionsSchema,
  testimonialsSchema,
} = schema;

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is required. Set it in .env');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();
  const db = drizzle(client, { schema });

  console.log('Seeding verticals...');

  // ============================================================
  // GENTIC AI
  // ============================================================
  const [gentic] = await db.insert(verticalsSchema).values({
    slug: 'gentic-ai',
    brandName: 'Gentic AI',
    tagline: 'AI That Books Your Clients',
    domain: 'gentic.pro',
    theme: {
      colorAccent: '#6e5ce6',
      colorAccentHover: '#5a48c8',
      colorAccentGlow: 'rgba(110, 92, 230, 0.4)',
      colorBgPrimary: '#ffffff',
      colorBgSecondary: '#f8f9fa',
      colorTextPrimary: '#1d1d1f',
      colorTextSecondary: '#6e6e73',
      colorTextTertiary: '#86868b',
      fontHeading: "'DM Sans', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      darkMode: false,
    },
    metaTitle: 'Gentic AI — AI-Powered Lead Scoring & Voice Booking for Local Businesses',
    metaDescription: 'AI-powered lead scoring, voice qualification, and automated booking. Your business runs 24/7 while you focus on what matters.',
    features: {
      voiceModal: true,
      stripe: true,
      customFields: [
        { name: 'businessType', label: 'Business Type', type: 'select', required: true },
        { name: 'monthlyLeads', label: 'Monthly Leads', type: 'number', required: false },
      ],
    },
    contactEmail: 'contact@gentic.pro',
    status: 'active',
  }).returning();

  // Gentic sections
  await db.insert(sectionsSchema).values([
    {
      verticalId: gentic!.id,
      sectionType: 'hero',
      sortOrder: 1,
      content: {
        headline: 'AI That Books Your Clients',
        headlineWords: ['AI', 'That', 'Books', 'Your', 'Clients'],
        rotatingWords: ['MedSpas', 'Salons', 'Tattoo Studios', 'Nail Studios', 'Real Estate'],
        subheadline: 'for {rotating}',
        description: 'AI-powered lead scoring, voice qualification, and automated booking. Your business runs 24/7 while you focus on what matters.',
        primaryCta: { text: 'Talk to Our AI', action: '#voice' },
        secondaryCta: { text: 'See Pricing', href: '#pricing' },
      },
    },
    {
      verticalId: gentic!.id,
      sectionType: 'stats_bar',
      sortOrder: 2,
      content: {
        stats: [
          { value: 5, suffix: ' Verticals', label: 'MedSpa · Salon · Tattoo · Nails · RE' },
          { value: 100, suffix: '-point', label: 'Lead Scoring Engine' },
          { value: 0.001, prefix: '$', label: 'Per Lead Cost', isDecimal: true },
          { value: 24, suffix: '/7', label: 'Voice AI Booking' },
        ],
      },
    },
    {
      verticalId: gentic!.id,
      sectionType: 'process_steps',
      sortOrder: 3,
      content: {
        title: 'How it works',
        steps: [
          { number: '01', title: 'Capture', description: 'Leads from web forms, social, calls, walk-ins. Normalized and deduplicated automatically.' },
          { number: '02', title: 'Score', description: 'AI scores every lead 0–100 on intent, fit, and urgency. Prioritizes who\'s ready to book.' },
          { number: '03', title: 'Book', description: 'Voice AI engages hot leads instantly. Books consultations, appointments, and follow-ups 24/7.' },
        ],
      },
    },
    {
      verticalId: gentic!.id,
      sectionType: 'social_proof',
      sortOrder: 4,
      content: {
        badge: 'Trusted by MedSpas, salons, and investors across the Southwest',
      },
    },
    {
      verticalId: gentic!.id,
      sectionType: 'pricing',
      sortOrder: 5,
      content: {
        badge: 'Early Adopter Pricing — Locked In Forever',
        title: "Founder's rate",
        description: "Join now and keep this price as long as you're a customer. No tricks.",
        plans: [
          {
            name: 'Growth Engine',
            price: '497',
            originalPrice: '1,797',
            description: 'For solo operators',
            features: ['500 leads/month', '300 voice AI minutes', 'Lead scoring engine', 'Automated booking', 'Email support'],
            popular: false,
            ctaText: 'Subscribe Now',
            priceId: 'price_1T2EWVBgzLEFvozzLIv2PBex',
          },
          {
            name: 'Lead Recovery',
            price: '997',
            originalPrice: '2,497',
            description: 'For teams up to 10',
            features: ['2,000 leads/month', '1,500 voice AI minutes', 'Lead scoring engine', 'Priority support', 'Custom integrations', 'Dedicated account manager'],
            popular: true,
            ctaText: 'Subscribe Now',
            priceId: 'price_1T1C0zBgzLEFvozz2B0Y4Ce0',
          },
        ],
      },
    },
    {
      verticalId: gentic!.id,
      sectionType: 'cta_banner',
      sortOrder: 6,
      content: {
        title: 'See how Gentic works for your business',
        description: 'Talk to our AI advisor. 2 minutes to find the right fit for your MedSpa, salon, or studio.',
        ctaText: 'Start a Conversation',
        ctaAction: '#voice',
        darkBg: true,
      },
    },
    {
      verticalId: gentic!.id,
      sectionType: 'faq',
      sortOrder: 7,
      content: {
        title: 'Frequently Asked Questions',
        items: [
          { question: 'How does the AI scoring work?', answer: 'Our iRELOP engine scores every lead on a 100-point scale across three dimensions: Motivation (40 points), Opportunity (35 points), and Profile (25 points). Hot leads (80+) get voice outreach, warm leads (60+) get SMS, and cool leads (40+) get email sequences.' },
          { question: 'Can I try the voice AI before signing up?', answer: 'Absolutely! Click "Talk to Our AI" and you\'ll connect with our AI advisor Alex instantly. No sign-up required — just tell it about your business and it\'ll show you exactly how Gentic would work for you.' },
          { question: 'What businesses does Gentic work for?', answer: 'Gentic is built for appointment-based local businesses: MedSpas, salons, tattoo studios, nail studios, and real estate. We\'re expanding to more verticals soon.' },
          { question: 'How long does setup take?', answer: 'Most businesses are fully onboarded in under 48 hours. We connect to your existing forms, CRM, and scheduling tool. No code changes needed on your end.' },
          { question: 'Is the early adopter pricing really locked in?', answer: 'Yes. Your rate is locked for as long as you maintain an active subscription. Even when we raise prices for new customers, you keep your founder rate.' },
        ],
      },
    },
  ]);

  // Gentic testimonials
  await db.insert(testimonialsSchema).values([
    {
      verticalId: gentic!.id,
      name: 'Dr. Priya Shah',
      role: 'MedSpa Owner, Scottsdale AZ',
      quote: 'We went from missing 60% of consultation requests to booking them automatically. Revenue up 40% in month one.',
      rating: 5,
      resultMetric: '+40% Revenue',
      sortOrder: 1,
    },
    {
      verticalId: gentic!.id,
      name: 'Marcus Chen',
      role: 'Real Estate Investor, Phoenix AZ',
      quote: 'The AI scores leads and books appointments before my team even sees them. We stopped chasing dead leads entirely.',
      rating: 5,
      resultMetric: '0 Dead Leads',
      sortOrder: 2,
    },
    {
      verticalId: gentic!.id,
      name: 'Kayla Torres',
      role: 'Salon Owner, Las Vegas NV',
      quote: 'Voice AI booking at 2am is a game-changer. We picked up 12 new clients last week while the studio was closed.',
      rating: 5,
      resultMetric: '+12 Clients/Week',
      sortOrder: 3,
    },
  ]);

  console.log('Gentic AI seeded.');

  // ============================================================
  // DEALIQ
  // ============================================================
  const [dealiq] = await db.insert(verticalsSchema).values({
    slug: 'dealiq',
    brandName: 'DealiQ',
    tagline: 'Real Estate Intelligence, Automated',
    domain: 'dealiq.click',
    theme: {
      colorAccent: '#f59e0b',
      colorAccentHover: '#d97706',
      colorAccentGlow: 'rgba(245, 158, 11, 0.4)',
      colorBgPrimary: '#0a0a0b',
      colorBgSecondary: '#1d1d1f',
      colorTextPrimary: '#f5f5f7',
      colorTextSecondary: '#a1a1a6',
      colorTextTertiary: '#6e6e73',
      fontHeading: "'Sora', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      darkMode: true,
    },
    metaTitle: 'DealiQ — AI-Powered Real Estate Data Analysis & Lead Intelligence',
    metaDescription: 'AI-driven property data analysis, motivated seller scoring, and deal pipeline automation for real estate investors.',
    features: {
      voiceModal: false,
      stripe: true,
      customFields: [
        { name: 'propertyAddress', label: 'Property Address', type: 'text', required: false },
        { name: 'timeline', label: 'Timeline', type: 'select', required: false },
      ],
    },
    contactEmail: 'deals@dealiq.click',
    status: 'active',
  }).returning();

  // DealiQ sections
  await db.insert(sectionsSchema).values([
    {
      verticalId: dealiq!.id,
      sectionType: 'hero',
      sortOrder: 1,
      content: {
        headline: 'Find Deals Before They Hit the Market',
        headlineWords: ['Find', 'Deals', 'Before', 'They', 'Hit', 'the', 'Market'],
        rotatingWords: [],
        subheadline: 'AI-powered property analysis for serious investors',
        description: 'DealiQ scores every lead with our 100-point iRELOP engine, surfaces motivated sellers, and automates your deal pipeline from intake to close.',
        primaryCta: { text: 'Get Started', action: '#contact' },
        secondaryCta: { text: 'See Plans', href: '#pricing' },
      },
    },
    {
      verticalId: dealiq!.id,
      sectionType: 'problem',
      sortOrder: 2,
      content: {
        title: 'The Old Way Is Broken',
        subtitle: 'The Problem',
        painPoints: [
          { title: 'Data Overload', description: 'Thousands of records, no way to tell which sellers are motivated. You waste time on dead leads.' },
          { title: 'Slow Pipeline', description: 'By the time you analyze a deal manually, someone else already closed it. Speed wins in RE.' },
          { title: 'No Scoring', description: 'Every lead looks the same in your CRM. No prioritization means you work harder, not smarter.' },
        ],
      },
    },
    {
      verticalId: dealiq!.id,
      sectionType: 'solution',
      sortOrder: 3,
      content: {
        title: 'The DealiQ Way',
        subtitle: 'The Solution',
        benefits: [
          { title: 'iRELOP Scoring', description: 'Every lead scored 0-100 on Motivation, Opportunity, and Profile. Hot leads surface instantly.' },
          { title: 'Automated Pipeline', description: 'Intake to outreach in minutes. Hot leads get calls, warm leads get SMS, cool leads get email.' },
          { title: 'Market Intelligence', description: 'AI-driven comp analysis, ARV estimates, and deal metrics — all in one dashboard.' },
        ],
      },
    },
    {
      verticalId: dealiq!.id,
      sectionType: 'stats_bar',
      sortOrder: 4,
      content: {
        stats: [
          { value: 100, suffix: '-pt', label: 'iRELOP Score Engine' },
          { value: 4, suffix: ' Markets', label: 'Phoenix · Vegas · AZ · UT' },
          { value: 10, suffix: 'x', label: 'Faster Lead Analysis' },
          { value: 95, suffix: '%', label: 'Accuracy Rate' },
        ],
      },
    },
    {
      verticalId: dealiq!.id,
      sectionType: 'pricing',
      sortOrder: 5,
      content: {
        badge: 'Data Analysis SKUs',
        title: 'Choose Your Analysis Tier',
        description: 'Pay only for the analysis depth you need. All tiers include iRELOP scoring.',
        plans: [
          {
            name: 'Starter Analysis',
            price: '297',
            description: 'For individual investors',
            features: ['100 property analyses/month', 'iRELOP scoring', 'Basic comp data', 'CSV exports', 'Email support'],
            popular: false,
            ctaText: 'Start Analyzing',
          },
          {
            name: 'Pro Analysis',
            price: '797',
            description: 'For active investors & teams',
            features: ['500 property analyses/month', 'iRELOP scoring', 'Deep comp analysis', 'ARV estimates', 'Priority support', 'API access'],
            popular: true,
            ctaText: 'Go Pro',
          },
        ],
      },
    },
    {
      verticalId: dealiq!.id,
      sectionType: 'cta_banner',
      sortOrder: 6,
      content: {
        title: 'Stop guessing. Start closing.',
        description: 'Get your first 10 property analyses free. See how iRELOP scores your market.',
        ctaText: 'Start Free Analysis',
        ctaAction: '#contact',
        darkBg: false,
      },
    },
    {
      verticalId: dealiq!.id,
      sectionType: 'faq',
      sortOrder: 7,
      content: {
        title: 'Frequently Asked Questions',
        items: [
          { question: 'What is iRELOP scoring?', answer: 'iRELOP is our 100-point lead scoring engine. It evaluates seller Motivation (40 points), deal Opportunity (35 points), and lead Profile (25 points). Leads scoring 80+ are flagged as HOT for immediate outreach.' },
          { question: 'Which markets does DealiQ cover?', answer: 'We currently cover Phoenix, Las Vegas, Arizona, and Utah markets with deep data. We\'re expanding to additional markets quarterly.' },
          { question: 'Can I integrate DealiQ with my existing CRM?', answer: 'Yes. The Pro tier includes API access. We also integrate natively with popular RE CRMs through our webhook system.' },
          { question: 'How accurate are the ARV estimates?', answer: 'Our AI-driven ARV estimates have a 95% accuracy rate within 5% of actual sale prices, based on our last 12 months of verified data.' },
        ],
      },
    },
  ]);

  // DealiQ testimonials
  await db.insert(testimonialsSchema).values([
    {
      verticalId: dealiq!.id,
      name: 'Jake Morrison',
      role: 'Wholesaler, Phoenix AZ',
      quote: 'DealiQ found 3 motivated sellers in my first week that I would have completely missed. Already closed one for $22K assignment fee.',
      rating: 5,
      resultMetric: '$22K First Deal',
      sortOrder: 1,
    },
    {
      verticalId: dealiq!.id,
      name: 'Sarah Williams',
      role: 'Fix & Flip Investor, Las Vegas NV',
      quote: 'The iRELOP scoring is scary accurate. Every lead it scores 80+ has been a real opportunity. No more wasted driving for dollars.',
      rating: 5,
      resultMetric: '100% Hot Lead Accuracy',
      sortOrder: 2,
    },
    {
      verticalId: dealiq!.id,
      name: 'Andre Jackson',
      role: 'Real Estate Team Lead, Mesa AZ',
      quote: 'My team used to spend 4 hours daily on manual lead analysis. Now DealiQ does it in minutes. We focus on closing instead of sorting.',
      rating: 5,
      resultMetric: '4 Hours Saved Daily',
      sortOrder: 3,
    },
  ]);

  console.log('DealiQ seeded.');

  // ============================================================
  // VOICESCHEDULEAI
  // ============================================================
  const [vsai] = await db.insert(verticalsSchema).values({
    slug: 'voicescheduleai',
    brandName: 'VoiceScheduleAI',
    tagline: 'Never Miss Another Appointment',
    domain: 'voicescheduleai.com',
    theme: {
      colorAccent: '#14b8a6',
      colorAccentHover: '#0d9488',
      colorAccentGlow: 'rgba(20, 184, 166, 0.4)',
      colorBgPrimary: '#ffffff',
      colorBgSecondary: '#f0fdfa',
      colorTextPrimary: '#1d1d1f',
      colorTextSecondary: '#6e6e73',
      colorTextTertiary: '#86868b',
      fontHeading: "'Outfit', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      darkMode: false,
    },
    metaTitle: 'VoiceScheduleAI — AI Voice Scheduling for Businesses',
    metaDescription: 'AI voice agent that answers calls, qualifies leads, and books appointments 24/7. Never miss another opportunity.',
    features: {
      voiceModal: true,
      stripe: true,
      customFields: [],
    },
    contactEmail: 'hello@voicescheduleai.com',
    status: 'active',
  }).returning();

  // VoiceScheduleAI sections
  await db.insert(sectionsSchema).values([
    {
      verticalId: vsai!.id,
      sectionType: 'hero',
      sortOrder: 1,
      content: {
        headline: 'Your AI Receptionist That Never Sleeps',
        headlineWords: ['Your', 'AI', 'Receptionist', 'That', 'Never', 'Sleeps'],
        rotatingWords: [],
        subheadline: 'AI-powered scheduling for every business',
        description: 'VoiceScheduleAI answers calls, qualifies leads, and books appointments 24/7. Your customers get instant service while you focus on your craft.',
        primaryCta: { text: 'Try the Voice AI', action: '#voice' },
        secondaryCta: { text: 'See Pricing', href: '#pricing' },
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'features',
      sortOrder: 2,
      content: {
        title: 'Everything You Need to Never Miss a Call',
        subtitle: 'Features',
        description: 'From the first ring to the confirmed booking, VoiceScheduleAI handles it all.',
        items: [
          { title: '24/7 Availability', description: 'Your AI agent answers every call, text, and web inquiry — nights, weekends, holidays.' },
          { title: 'Smart Qualification', description: 'AI asks the right questions and scores each lead before booking. No more tire-kickers.' },
          { title: 'Instant Booking', description: 'Connects to your calendar and books appointments in real-time during the conversation.' },
          { title: 'Multi-Channel', description: 'Phone, SMS, web chat, and social DMs — all unified into one conversation stream.' },
          { title: 'Natural Conversations', description: 'Advanced AI that sounds human. Handles objections, answers FAQs, and builds rapport.' },
          { title: 'CRM Integration', description: 'Every interaction logged, scored, and synced to your existing tools automatically.' },
        ],
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'stats_bar',
      sortOrder: 3,
      content: {
        stats: [
          { value: 24, suffix: '/7', label: 'Always Available' },
          { value: 98, suffix: '%', label: 'Booking Rate' },
          { value: 30, suffix: 's', label: 'Avg Response Time' },
          { value: 3, suffix: 'x', label: 'More Appointments' },
        ],
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'process_steps',
      sortOrder: 4,
      content: {
        title: 'How it works',
        steps: [
          { number: '01', title: 'Connect', description: 'Forward your business number to VoiceScheduleAI. Setup takes under 5 minutes.' },
          { number: '02', title: 'Qualify', description: 'AI answers calls naturally, asks qualifying questions, and determines booking readiness.' },
          { number: '03', title: 'Book', description: 'Qualified leads are booked directly into your calendar. You get notified instantly.' },
        ],
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'social_proof',
      sortOrder: 5,
      content: {
        badge: 'Trusted by hundreds of businesses nationwide',
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'pricing',
      sortOrder: 6,
      content: {
        title: 'Simple Pricing, Massive ROI',
        description: 'Every missed call is a missed opportunity. VoiceScheduleAI pays for itself with the first booking.',
        plans: [
          {
            name: 'Starter',
            price: '199',
            description: 'For solo practitioners',
            features: ['100 AI calls/month', 'Calendar integration', 'SMS follow-ups', 'Basic analytics', 'Email support'],
            popular: false,
            ctaText: 'Start Free Trial',
          },
          {
            name: 'Business',
            price: '499',
            description: 'For growing practices',
            features: ['500 AI calls/month', 'Multi-calendar support', 'SMS + email follow-ups', 'Advanced analytics', 'Priority support', 'Custom greeting scripts'],
            popular: true,
            ctaText: 'Start Free Trial',
          },
        ],
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'cta_banner',
      sortOrder: 7,
      content: {
        title: 'Hear it for yourself',
        description: 'Try our AI voice agent right now. See how it handles a real scheduling conversation.',
        ctaText: 'Talk to Our AI',
        ctaAction: '#voice',
        darkBg: true,
      },
    },
    {
      verticalId: vsai!.id,
      sectionType: 'faq',
      sortOrder: 8,
      content: {
        title: 'Frequently Asked Questions',
        items: [
          { question: 'Does it really sound human?', answer: 'Yes. Our AI uses advanced natural language processing and speech synthesis to hold conversations that feel natural. Most callers can\'t tell they\'re talking to AI.' },
          { question: 'What calendars do you integrate with?', answer: 'We integrate with Google Calendar, Microsoft Outlook, Calendly, Acuity, and most scheduling platforms via API.' },
          { question: 'Can I customize what the AI says?', answer: 'Absolutely. You can customize greetings, qualifying questions, booking rules, and more. The Business plan includes custom scripts.' },
          { question: 'What happens if the AI can\'t handle a call?', answer: 'If the AI encounters a question it can\'t answer or the caller requests a human, it transfers to your designated number immediately.' },
        ],
      },
    },
  ]);

  // VoiceScheduleAI testimonials
  await db.insert(testimonialsSchema).values([
    {
      verticalId: vsai!.id,
      name: 'Dr. Lisa Chang',
      role: 'Dentist, Portland OR',
      quote: 'We were missing 40% of calls during busy hours. VoiceScheduleAI books those appointments now. Our schedule is consistently full.',
      rating: 5,
      resultMetric: '+40% Bookings',
      sortOrder: 1,
    },
    {
      verticalId: vsai!.id,
      name: 'Mike Hernandez',
      role: 'Auto Shop Owner, Austin TX',
      quote: 'My guys are under cars all day. Now every call gets answered and appointments get booked. Revenue up 25% in 60 days.',
      rating: 5,
      resultMetric: '+25% Revenue',
      sortOrder: 2,
    },
    {
      verticalId: vsai!.id,
      name: 'Jennifer Park',
      role: 'Yoga Studio, San Diego CA',
      quote: 'The AI handles class bookings, cancellations, and waitlist management. It\'s like having a full-time receptionist for a fraction of the cost.',
      rating: 5,
      resultMetric: '90% Cost Savings',
      sortOrder: 3,
    },
  ]);

  console.log('VoiceScheduleAI seeded.');
  console.log('All verticals seeded successfully!');

  await client.end();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
