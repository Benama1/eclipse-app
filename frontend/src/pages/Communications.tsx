import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const PRIORITY_ICON: Record<string, string> = { urgent: '🔴', important: '🟠', normal: '🟡', info: '🟢' };

export default function Communications() {
  const { canWrite, hasAccess } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'Communication', priority: 'normal' });

  function refresh() { api.get('/communications').then((r) => setList(r.data)); }
  useEffect(refresh, []);
  if (!hasAccess('dashboard')) return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post('/communications', form);
    setForm({ title: '', content: '', category: 'Communication', priority: 'normal' });
    refresh();
  }
  async function remove(id: string) { await api.delete(`/communications/${id}`); refresh(); }

  return (
    <div>
      <h2>Communications</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>Fusion des anciens onglets Notes + Communications, triée par priorité.</p>
      {canWrite && (
        <form onSubmit={create} className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
            <div className="form-row"><label>Titre</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-row"><label>Catégorie</label>
              <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Note</option><option>Communication</option><option>Annonce</option><option>Information</option><option>Actualité</option>
              </select>
            </div>
            <div className="form-row"><label>Priorité</label>
              <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="urgent">🔴 Urgent</option><option value="important">🟠 Important</option><option value="normal">🟡 Normal</option><option value="info">🟢 Information</option>
              </select>
            </div>
          </div>
          <div className="form-row"><label>Contenu</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <button className="btn btn-accent">Publier</button>
        </form>
      )}
      {list.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700 }}>{PRIORITY_ICON[c.priority]} {c.title} <span className="pill pill-muted">{c.category}</span></div>
            {canWrite && <button className="btn btn-ghost" onClick={() => remove(c.id)}>Supprimer</button>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-faint)', margin: '4px 0' }}>{c.author} · {c.date}</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{c.content}</p>
        </div>
      ))}
    </div>
  );
}
