'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      gap: '20px',
      fontSize: '14px'
    }}>
      <h2>Something went wrong!</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button onClick={reset} style={{ textDecoration: 'underline' }}>
          Try again
        </button>
        <Link href="/" style={{ textDecoration: 'underline' }}>
          Go home
        </Link>
      </div>
    </div>
  );
}

