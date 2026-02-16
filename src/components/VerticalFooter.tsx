import type { Vertical } from '@/types/Vertical';

interface VerticalFooterProps {
  vertical: Vertical;
}

export function VerticalFooter({ vertical }: VerticalFooterProps) {
  return (
    <footer className="border-t px-6 py-16 lg:px-8 lg:py-20" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
            {vertical.brandName}
          </span>

          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <a href="#platform" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>Platform</a>
            <a href="#pricing" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>Pricing</a>
            {vertical.contactEmail && (
              <a href={`mailto:${vertical.contactEmail}`} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>Contact</a>
            )}
            <a href="#" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>Terms</a>
            <a href="#" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>Privacy</a>
          </nav>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            &copy; {new Date().getFullYear()} {vertical.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}
