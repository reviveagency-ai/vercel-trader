export const dynamic = 'force-dynamic';

export async function GET() {
  const base = process.env.BACKEND_URL!;
  try {
    const r = await fetch(`${base}/health`, { cache: 'no-store' });
    const data = await r.json();
    return new Response(JSON.stringify(data), { status: r.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, error: String(e?.message || e) }), { status: 500 });
  }
}
