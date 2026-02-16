export type SectionType =
  | 'hero'
  | 'problem'
  | 'solution'
  | 'features'
  | 'social_proof'
  | 'pricing'
  | 'faq'
  | 'cta_banner'
  | 'authority'
  | 'process_steps'
  | 'comparison'
  | 'video_embed'
  | 'stats_bar';

export interface HeroContent {
  headline: string;
  headlineWords?: string[];
  rotatingWords?: string[];
  subheadline: string;
  description: string;
  primaryCta: { text: string; action: string };
  secondaryCta?: { text: string; href: string };
}

export interface StatsBarContent {
  stats: Array<{
    value: number;
    prefix?: string;
    suffix?: string;
    label: string;
    isDecimal?: boolean;
  }>;
}

export interface ProcessStepsContent {
  title: string;
  steps: Array<{
    number: string;
    title: string;
    description: string;
  }>;
}

export interface PricingContent {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  plans: Array<{
    name: string;
    price: string;
    originalPrice?: string;
    description: string;
    features: string[];
    popular?: boolean;
    priceId?: string;
    ctaText?: string;
  }>;
}

export interface FaqContent {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface CtaBannerContent {
  title: string;
  description: string;
  ctaText: string;
  ctaAction: string;
  darkBg?: boolean;
}

export interface SocialProofContent {
  badge?: string;
  title?: string;
}

export interface FeaturesContent {
  title: string;
  subtitle?: string;
  description?: string;
  items: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ProblemContent {
  title: string;
  subtitle?: string;
  painPoints: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface SolutionContent {
  title: string;
  subtitle?: string;
  benefits: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ComparisonContent {
  title: string;
  headers: [string, string];
  rows: Array<{
    feature: string;
    us: string;
    them: string;
  }>;
}

export interface VideoEmbedContent {
  title?: string;
  videoUrl: string;
  provider: 'youtube' | 'vimeo';
}

export interface AuthorityContent {
  title: string;
  body: string;
}

export type SectionContent =
  | HeroContent
  | StatsBarContent
  | ProcessStepsContent
  | PricingContent
  | FaqContent
  | CtaBannerContent
  | SocialProofContent
  | FeaturesContent
  | ProblemContent
  | SolutionContent
  | ComparisonContent
  | VideoEmbedContent
  | AuthorityContent;

export interface Section {
  id: number;
  verticalId: number;
  sectionType: SectionType;
  sortOrder: number;
  content: SectionContent;
  visible: boolean;
}
