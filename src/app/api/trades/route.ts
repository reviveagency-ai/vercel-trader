// src/app/api/trades/route.ts
export const dynamic = 'force-dynamic';

type ErrorShape = { ok: false; error: string; status?: number };
type OkShape = { ok: true } & Record<string, unknown>;
type TradesResponse = OkShape | ErrorShape;

export async function GET(): Promise<Response> {
  const base = process.env.BACKEND_URL!;
  const key = process.env.FRONTEND_API_KEY ?? '';
  try {
    const r = await fetch(`${base}/trades`, {
      headers: { 'x-api-key': key },
      cache: 'no-store',
    });

    const txt = await r.text();
    let data: unknown;
    try {
      data = JSON.parse(txt) as TradesResponse;
    } catch {
      data = { raw: txt };
    }

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
