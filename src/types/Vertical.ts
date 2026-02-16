export interface VerticalTheme {
  colorAccent: string;
  colorAccentHover: string;
  colorAccentGlow: string;
  colorBgPrimary: string;
  colorBgSecondary: string;
  colorTextPrimary: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;
}

export interface VerticalFeatures {
  voiceModal: boolean;
  stripe: boolean;
  customFields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
  }>;
}

export interface Vertical {
  id: number;
  slug: string;
  brandName: string;
  tagline: string | null;
  domain: string | null;
  theme: VerticalTheme;
  metaTitle: string | null;
  metaDescription: string | null;
  features: VerticalFeatures | null;
  gaId: string | null;
  contactEmail: string | null;
  status: string;
}
