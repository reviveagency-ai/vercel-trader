// src/app/envtest/page.tsx
export const dynamic = 'force-dynamic';

type Health = { ok: boolean; [k: string]: unknown };
type Trades = { ok: boolean } & Record<string, unknown>;

async function getJSON<T>(path: string): Promise<T | { ok: false; error: string }> {
  try {
    const r = await fetch(path, { cache: 'no-store' });
    return (await r.json()) as T;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export default async function EnvTestPage() {
  // ✅ use relative internal API routes
  const health = (await getJSON<Health>('http://localhost:3000/api/health')) as Health;
  const trades = (await getJSON<Trades>('http://localhost:3000/api/trades')) as Trades;

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
