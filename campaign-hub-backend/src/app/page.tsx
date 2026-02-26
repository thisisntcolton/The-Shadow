export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'serif', background: '#1a1614', color: '#d4af37', minHeight: '100vh' }}>
      <h1>Shire Adventures API</h1>
      <p>Status: <span style={{ color: '#4ade80' }}>Online</span></p>
      <p>Endpoint: <code>/api/loot</code></p>
    </div>
  );
}