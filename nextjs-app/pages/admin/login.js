import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        localStorage.setItem('adminToken', token);
        router.push('/admin');
      } else {
        setMsg(json.error || 'Invalid token');
      }
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Admin Login</h1>
      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Admin Token</label>
          <input value={token} onChange={e => setToken(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <button type="submit">Login</button>
          <span style={{ marginLeft: 12, color: 'red' }}>{msg}</span>
        </div>
      </form>
    </div>
  );
}
