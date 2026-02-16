'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
