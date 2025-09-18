// src/lib/api.ts
export async function api(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_FRONTEND_API_KEY ?? '',
      ...(opts.headers || {})
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
