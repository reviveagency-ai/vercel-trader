// src/app/envtest/page.tsx
export const dynamic = 'force-dynamic';

type Json = Record<string, unknown>;

async function getJSON(origin: string, path: string): Promise<Json> {
  const r = await fetch(`${origin}${path}`, { cache: 'no-store' });
  const txt = await r.text();
  try { return JSON.parse(txt) as Json; } catch { return { ok: false, error: txt, status: r.status }; }
}

export default async function EnvTestPage() {
  // Vercel sets VERCEL_URL like vt-live.vercel.app on prod; fallback for local dev
  const host = process.env.VERCEL_URL ?? 'localhost:3000';
  const proto = process.env.VERCEL ? 'https' : 'http';
  const origin = `${proto}://${host}`;

  const health = await getJSON(origin, '/api/health');
  const trades = await getJSON(origin, '/api/trades');

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Env / API Test</h1>
      <h2>Health</h2><pre>{JSON.stringify(health, null, 2)}</pre>
      <h2>Trades</h2><pre>{JSON.stringify(trades, null, 2)}</pre>
    </div>
  );
}
