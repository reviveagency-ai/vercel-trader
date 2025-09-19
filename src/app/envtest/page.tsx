// src/app/envtest/page.tsx
import { api } from '@/lib/api';

export default async function EnvTestPage() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  let health: any = { ok: false, error: 'not fetched' };
  let trades: any = { ok: false, error: 'not fetched' };

  try {
    if (!base) throw new Error('NEXT_PUBLIC_BACKEND_URL missing');
    const r = await fetch(`${base}/health`, { cache: 'no-store' });
    health = await r.json();
  } catch (e: any) {
    health = { ok: false, error: String(e?.message || e) };
  }

  trades = await api('/trades'); // will never throw now

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Env / API Test</h1>
      <p><b>BACKEND_URL:</b> {base || '(not set)'}</p>
      <h2>Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>
      <h2>Trades (protected)</h2>
      <pre>{JSON.stringify(trades, null, 2)}</pre>
      <p style={{opacity:.7}}>If you see "Unauthorized: bad x-api-key", make the Vercel key exactly match backend API_KEY.</p>
    </div>
  );
}
