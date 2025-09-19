// src/app/api/health/route.ts
export const dynamic = 'force-dynamic';

type Health = {
  ok: boolean;
  port?: number;
  apiKeyConfigured?: boolean;
  [k: string]: unknown;
};

export async function GET(): Promise<Response> {
  const base = process.env.BACKEND_URL!;
  try {
    const r = await fetch(`${base}/health`, { cache: 'no-store' });
    const data = (await r.json()) as Health;
    return new Response(JSON.stringify(data), {
      status: r.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
