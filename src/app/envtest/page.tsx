// src/app/envtest/page.tsx
export const dynamic = 'force-dynamic';

type Json = Record<string, unknown>;

async function j(url: string) {
  const r = await fetch(url, { cache: 'no-store' });
  const txt = await r.text();
  try { return JSON.parse(txt) as Json; } catch { return { ok: false, error: txt, status: r.status }; }
}

export default async function EnvTestPage() {
  // Build absolute origin without headers()
  const host = process.env.VERCEL_URL ?? 'localhost:3000';
  const proto = process.env.VERCEL ? 'https' : 'http';
  const origin = `${proto}://${host}`;

  const health = await j(`${origin}/api/health`);
  const trades = await j(`${origin}/api/trades`);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Env / API Test</h1>
      <h2>Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>
      <h2>Trades</h2>
      <pre>{JSON.stringify(trades, null, 2)}</pre>
    </div>
  );
}
