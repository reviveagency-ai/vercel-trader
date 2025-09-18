// src/app/envtest/page.tsx
import { api } from '@/lib/api';

export default async function EnvTestPage() {
  const health = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`, { cache: 'no-store' }).then(r => r.json());
  const trades = await api('/trades');
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Env / API Test</h1>
      <h2>Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>
      <h2>Trades (protected)</h2>
      <pre>{JSON.stringify(trades, null, 2)}</pre>
    </div>
  );
}