// src/pages/envtest.tsx
import { api } from '@/lib/api';

export default function EnvTestPage(props:{health:any,trades:any}) {
  const { health, trades } = props;
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Env / API Test</h1>
      <h2>Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>

      <h2>Trades (protected)</h2>
      <pre>{JSON.stringify(trades, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const health = await fetch(`${base}/health`).then(r => r.json());
  const trades = await fetch(`${base}/trades`, {
    headers: { 'x-api-key': process.env.NEXT_PUBLIC_FRONTEND_API_KEY ?? '' },
  }).then(r => r.json());
  return { props: { health, trades } };
}
