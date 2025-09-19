// src/lib/api.ts
type APIError = { ok: false; status: number; error: string };
type APIData = unknown;

export async function api(path: string, opts: RequestInit = {}): Promise<APIData | APIError> {
  // Call our server proxy (/api/*) so no secrets are exposed client-side
  const res = await fetch(`/api${path}`, {
    ...opts,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });

  const txt = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(txt);
  } catch {
    data = { raw: txt };
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' && data !== null && 'error' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).error)
        : txt;
    return { ok: false, status: res.status, error: msg };
  }
  return data as APIData;
}
