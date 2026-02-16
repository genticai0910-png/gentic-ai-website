import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  server: {
    DATABASE_URL: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    N8N_WEBHOOK_URL: z.string().optional(),
    N8N_WEBHOOK_SECRET: z.string().optional(),
    REVALIDATE_SECRET: z.string().optional(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PK_GENTIC: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PK_DEALIQ: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PK_VSAI: z.string().optional(),
    NEXT_PUBLIC_GA_ID_GENTIC: z.string().optional(),
    NEXT_PUBLIC_GA_ID_DEALIQ: z.string().optional(),
    NEXT_PUBLIC_GA_ID_VSAI: z.string().optional(),
    NEXT_PUBLIC_WS_URL: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
    N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PK_GENTIC: process.env.NEXT_PUBLIC_STRIPE_PK_GENTIC,
    NEXT_PUBLIC_STRIPE_PK_DEALIQ: process.env.NEXT_PUBLIC_STRIPE_PK_DEALIQ,
    NEXT_PUBLIC_STRIPE_PK_VSAI: process.env.NEXT_PUBLIC_STRIPE_PK_VSAI,
    NEXT_PUBLIC_GA_ID_GENTIC: process.env.NEXT_PUBLIC_GA_ID_GENTIC,
    NEXT_PUBLIC_GA_ID_DEALIQ: process.env.NEXT_PUBLIC_GA_ID_DEALIQ,
    NEXT_PUBLIC_GA_ID_VSAI: process.env.NEXT_PUBLIC_GA_ID_VSAI,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
});
