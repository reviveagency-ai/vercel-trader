export const dynamic = 'force-dynamic';

export async function GET() {
  const base = process.env.BACKEND_URL!;
  const key  = process.env.FRONTEND_API_KEY ?? '';
  try {
    const r = await fetch(`${base}/trades`, {
      headers: { 'x-api-key': key },
      cache: 'no-store',
    });
    const txt = await r.text();
    return new Response(txt, { status: r.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, error: String(e?.message || e) }), { status: 500 });
  }
}
