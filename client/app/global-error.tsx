'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', margin: 0 }}>
        <main style={{ textAlign: 'center', padding: 24, maxWidth: 480 }}>
          <h1 style={{ margin: '0 0 12px' }}>Application Error</h1>
          <p style={{ color: '#666', margin: '0 0 16px' }}>
            Something went wrong while rendering this page.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '10px 16px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 8,
                border: 0,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '10px 16px',
                background: '#4b5563',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Go Home
            </a>
          </div>
          {error?.digest ? (
            <p style={{ marginTop: 12, fontSize: 12, color: '#999' }}>Digest: {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  );
}