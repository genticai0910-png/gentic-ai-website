import { createNavigation } from 'next-intl/navigation';

import { AllLocales, AppConfig } from '@/utils/AppConfig';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
});
