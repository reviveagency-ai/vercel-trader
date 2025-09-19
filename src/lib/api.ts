// src/lib/api.ts
export async function api(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_FRONTEND_API_KEY ?? '',
      ...(opts.headers || {}),
    },
    cache: 'no-store',
  });

  const txt = await res.text();
  let data: any;
  try { data = JSON.parse(txt); } catch { data = { raw: txt }; }

  if (!res.ok) {
    return { ok: false, status: res.status, error: data?.error ?? txt };
  }
  return data;
}
