// src/app/envtest/page.tsx
export const dynamic = 'force-dynamic';

type Health = { ok: boolean; [k: string]: unknown };
type Trades = { ok: boolean; [k: string]: unknown };

async function getJSON<T>(url: string): Promise<T | { ok: false; error: string; status?: number }> {
  const r = await fetch(url, { cache: 'no-store' });
  const txt = await r.text();
  try {
    const data = JSON.parse(txt) as T;
    // if server returned an error shape, just pass it through
    return data;
  } catch {
    return { ok: false, error: txt, status: r.status };
  }
}

export default async function EnvTestPage() {
  // Use our server-side proxies so secrets never hit the browser
  const health = (await getJSON<Health>('/api/health')) as Health;
  const trades = (await getJSON<Trades>('/api/trades')) as Trades;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Env / API Test</h1>

      <h2>Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>

      <h2>Trades (protected)</h2>
      <pre>{JSON.stringify(trades, null, 2)}</pre>

      <p style={{ opacity: 0.7 }}>
        If you see Unauthorized: bad x-api-key, make sure the server env <code>API_KEY</code> equals Vercel env{' '}
        <code>FRONTEND_API_KEY</code>.
      </p>
    </div>
  );
}
