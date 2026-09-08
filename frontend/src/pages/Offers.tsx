import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Offers() {
  const { canWrite, hasAccess } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', partner: '', discount: '-10%' });

  function refresh() { api.get('/offers').then((r) => setList(r.data)); }
  useEffect(refresh, []);
  if (!hasAccess('dashboard')) return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post('/offers', form);
    setForm({ title: '', description: '', partner: '', discount: '-10%' });
    refresh();
  }
  async function remove(id: string) { await api.delete(`/offers/${id}`); refresh(); }

  return (
    <div>
      <h2>Offres CE</h2>
      {canWrite && (
        <form onSubmit={create} className="card" style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
          <div className="form-row"><label>Titre</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-row"><label>Description</label><input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-row"><label>Partenaire</label><input className="input" value={form.partner} onChange={(e) => setForm({ ...form, partner: e.target.value })} /></div>
          <div className="form-row"><label>Réduction</label><input className="input" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
          <button className="btn btn-accent">Ajouter</button>
        </form>
      )}
      <div className="grid grid-3">
        {list.map((o) => (
          <div key={o.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="pill pill-warn">{o.discount}</span><span className="pill pill-muted">{o.status}</span>
            </div>
            <div style={{ fontWeight: 700 }}>{o.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-faint)', margin: '4px 0' }}>{o.partner} · {o.date}</div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{o.description}</p>
            {canWrite && <button className="btn btn-ghost" onClick={() => remove(o.id)}>Supprimer</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
