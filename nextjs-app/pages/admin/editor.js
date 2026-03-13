import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

function Tree({ data, onSelect }) {
  return (
    <div>
      {data.sections.map(sec => (
        <div key={sec.id} style={{ marginBottom: 12 }}>
          <strong>{sec.title}</strong>
          <ul>
            {sec.articles.map(art => (
              <li key={art.id}>
                <button onClick={() => onSelect(sec, art)} style={{ cursor: 'pointer' }}>{art.title}</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Editor() {
  const [page, setPage] = useState(null);
  const [selected, setSelected] = useState({ section: null, article: null, component: null });
  const [status, setStatus] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) { window.location.href = '/admin/login'; return; }
    setToken(t);
    fetch('/api/admin/page').then(r => r.json()).then(j => { setPage(j.data.pages['landing-shortcourse']); }).catch(e => console.error(e));
  }, []);

  function onSelect(section, article) {
    setSelected({ section, article, component: null });
  }

  function selectComponent(comp) {
    setSelected(s => ({ ...s, component: comp }));
  }

  function updateComponentField(key, value) {
    setSelected(s => {
      const comp = { ...s.component, [key]: value };
      return { ...s, component: comp };
    });
  }

  function saveComponent() {
    // apply to page state
    const { section, article, component } = selected;
    if (!section || !article || !component) return;
    const newPage = { ...page };
    const secIndex = newPage.sections.findIndex(s => s.id === section.id);
    if (secIndex === -1) return;
    const artIndex = newPage.sections[secIndex].articles.findIndex(a => a.id === article.id);
    if (artIndex === -1) return;
    const comps = newPage.sections[secIndex].articles[artIndex].components.map(c => c.id === component.id ? component : c);
    newPage.sections[secIndex].articles[artIndex].components = comps;
    setPage(newPage);
    // persist
    setStatus('Saving...');
    fetch('/api/admin/page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ pages: { 'landing-shortcourse': newPage } })
    }).then(r => r.json()).then(j => {
      if (j && j.ok) setStatus('Saved'); else setStatus('Save failed');
    }).catch(e => setStatus('Save error'));
  }

  if (!page) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 320 }}>
          <h3>Structure</h3>
          <Tree data={page} onSelect={onSelect} />
        </div>
        <div style={{ flex: 1 }}>
          {selected.article ? (
            <div>
              <h2>{selected.article.title}</h2>
              <h4>Components</h4>
              <ul>
                {selected.article.components.map(c => (
                  <li key={c.id}><button onClick={() => selectComponent(c)}>{c.type} - {c.id}</button></li>
                ))}
              </ul>
              {selected.component ? (
                <div style={{ marginTop: 16 }}>
                  <h4>Edit Component {selected.component.id}</h4>
                  <div style={{ marginBottom: 8 }}>
                    <label>Type: {selected.component.type}</label>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label>Content</label>
                    <textarea value={selected.component.content || ''} onChange={e => updateComponentField('content', e.target.value)} rows={4} style={{ width: '100%' }} />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label>Props (JSON)</label>
                    <textarea value={JSON.stringify(selected.component.props || {}, null, 2)} onChange={e => {
                      try { const p = JSON.parse(e.target.value); updateComponentField('props', p); setStatus(''); }
                      catch (err) { setStatus('Invalid JSON'); }
                    }} rows={6} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <button onClick={saveComponent}>Save Component</button>
                    <span style={{ marginLeft: 12 }}>{status}</span>
                  </div>
                </div>
              ) : (<p>Select a component to edit.</p>)}
            </div>
          ) : (<p>Select an article to edit from the left.</p>)}
        </div>
      </div>
    </AdminLayout>
  );
}
