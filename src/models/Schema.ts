import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const verticalsSchema = pgTable('verticals', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  brandName: varchar('brand_name', { length: 128 }).notNull(),
  tagline: text('tagline'),
  domain: varchar('domain', { length: 128 }),
  theme: jsonb('theme').$type<{
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
  }>().notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  features: jsonb('features').$type<{
    voiceModal: boolean;
    stripe: boolean;
    customFields: Array<{ name: string; label: string; type: string; required: boolean }>;
  }>(),
  gaId: varchar('ga_id', { length: 32 }),
  contactEmail: varchar('contact_email', { length: 256 }),
  status: varchar('status', { length: 16 }).notNull().default('active'),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
});

export const sectionsSchema = pgTable('sections', {
  id: serial('id').primaryKey(),
  verticalId: integer('vertical_id').notNull().references(() => verticalsSchema.id),
  sectionType: varchar('section_type', { length: 64 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  content: jsonb('content').notNull(),
  visible: boolean('visible').notNull().default(true),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const testimonialsSchema = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  verticalId: integer('vertical_id').notNull().references(() => verticalsSchema.id),
  name: varchar('name', { length: 128 }).notNull(),
  role: varchar('role', { length: 256 }),
  quote: text('quote').notNull(),
  rating: integer('rating'),
  resultMetric: varchar('result_metric', { length: 256 }),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const leadsSchema = pgTable(
  'leads',
  {
    id: serial('id').primaryKey(),
    verticalId: integer('vertical_id').notNull().references(() => verticalsSchema.id),
    verticalSlug: varchar('vertical_slug', { length: 64 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 32 }),
    company: varchar('company', { length: 256 }),
    message: text('message'),
    utmSource: varchar('utm_source', { length: 128 }),
    utmMedium: varchar('utm_medium', { length: 128 }),
    utmCampaign: varchar('utm_campaign', { length: 128 }),
    utmContent: varchar('utm_content', { length: 128 }),
    utmTerm: varchar('utm_term', { length: 128 }),
    irelopScore: integer('irelop_score'),
    irelopTier: varchar('irelop_tier', { length: 16 }),
    customFields: jsonb('custom_fields').$type<Record<string, string>>(),
    syncedToVps: boolean('synced_to_vps').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
  },
  (table) => ({
    emailVerticalIdx: uniqueIndex('email_vertical_idx').on(table.email, table.verticalId),
  }),
);

export const verticalsRelations = relations(verticalsSchema, ({ many }) => ({
  sections: many(sectionsSchema),
  testimonials: many(testimonialsSchema),
  leads: many(leadsSchema),
}));

export const sectionsRelations = relations(sectionsSchema, ({ one }) => ({
  vertical: one(verticalsSchema, {
    fields: [sectionsSchema.verticalId],
    references: [verticalsSchema.id],
  }),
}));

export const testimonialsRelations = relations(testimonialsSchema, ({ one }) => ({
  vertical: one(verticalsSchema, {
    fields: [testimonialsSchema.verticalId],
    references: [verticalsSchema.id],
  }),
}));

export const leadsRelations = relations(leadsSchema, ({ one }) => ({
  vertical: one(verticalsSchema, {
    fields: [leadsSchema.verticalId],
    references: [verticalsSchema.id],
  }),
}));
