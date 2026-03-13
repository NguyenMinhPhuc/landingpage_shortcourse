import React from 'react';

export default function AdminLayout({ children }) {
  const logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ height: 64, background: '#0b2545', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Admin Panel</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Signed in</div>
          <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: 220, background: '#0f3358', color: '#e6f0ff', padding: 16, boxSizing: 'border-box' }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><a href="/admin" style={{ color: 'inherit', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: 6 }}>Dashboard</a></li>
              <li><a href="/admin/editor" style={{ color: 'inherit', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: 6 }}>Page Editor</a></li>
              <li><a href="/admin" style={{ color: 'inherit', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: 6 }}>Courses</a></li>
              <li><a href="/" style={{ color: 'inherit', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: 6 }}>View Site</a></li>
            </ul>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 20, background: '#f6f9ff', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>

      <footer style={{ height: 48, background: '#f1f5fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#333' }}>
        © {new Date().getFullYear()} Your Company — All rights reserved.
      </footer>
    </div>
  );
}
