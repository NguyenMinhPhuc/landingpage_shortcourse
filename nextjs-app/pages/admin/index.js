import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [adminToken, setAdminToken] = useState('');

  // On mount: ensure token exists and is valid, otherwise redirect to login
  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) return (window.location.href = '/admin/login');
    // verify token with server
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: t })
    }).then(r => r.json())
      .then(json => {
        if (json && json.ok) {
          setAdminToken(t);
          // load items
          fetch('/api/courses')
            .then(r => r.json())
            .then(data => setItems((data && data.data) ? data.data : []))
            .catch(e => console.error(e));
        } else {
          window.location.href = '/admin/login';
        }
      }).catch(() => window.location.href = '/admin/login');
  }, []);

  function edit(item) {
    setSelected({ ...item });
    setMsg('');
  }

  function updateField(k, v) {
    setSelected(s => ({ ...s, [k]: v }));
  }

  function save() {
    if (!selected || !selected.id) return;
    setSaving(true);
    setMsg('');
    const payload = {
      id: selected.id,
      title: selected.title,
      desc: selected.description || selected.desc || '',
      meta: selected.meta || []
    };
    // if meta is a string from UI, ensure array
    if (typeof payload.meta === 'string') {
      payload.meta = payload.meta.split('\n').map(s => s.trim()).filter(Boolean);
    }

    fetch('/api/admin/saveCourse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
      body: JSON.stringify(payload)
    }).then(r => r.json())
      .then(res => {
        if (res && res.ok) {
          setMsg('Saved successfully');
        } else {
          setMsg('Save failed: ' + (res && res.error || JSON.stringify(res)));
        }
      }).catch(e => setMsg('Save error: ' + e.message))
      .finally(() => setSaving(false));
  }

  function handleLogin(token) {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setShowLogin(false);
  }

  return (
    <AdminLayout>
      <div style={{ padding: 8 }}>
        <h1 style={{ marginTop: 0 }}>Edit Courses</h1>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ width: 360 }}>
            <h3>Items</h3>
            <ul>
              {items.map(it => (
                <li key={it.id} style={{ marginBottom: 8 }}>
                  <button onClick={() => edit(it)} style={{ cursor: 'pointer' }}>{it.title || it.slug || it.id}</button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: 1 }}>
            {selected ? (
              <div>
                <h3>Editing: {selected.id}</h3>
                <div style={{ marginBottom: 8 }}>
                  <label>Title</label>
                  <input value={selected.title || ''} onChange={e => updateField('title', e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Description</label>
                  <textarea value={selected.description || selected.desc || ''} onChange={e => updateField('desc', e.target.value)} rows={4} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Meta (one per line)</label>
                  <textarea value={(selected.meta && Array.isArray(selected.meta)) ? selected.meta.join('\n') : (selected.meta || '')} onChange={e => updateField('meta', e.target.value)} rows={6} style={{ width: '100%' }} />
                </div>
                <div>
                  <button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <span style={{ marginLeft: 12 }}>{msg}</span>
                </div>
              </div>
            ) : (
              <p>Select an item to edit.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
