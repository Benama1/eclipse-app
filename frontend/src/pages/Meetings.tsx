import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Meetings() {
  const { canWrite, hasAccess } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', date: '', time: '10:00', location: '', participants: 5, description: '' });

  function refresh() { api.get('/meetings').then((r) => setList(r.data)); }
  useEffect(refresh, []);
  if (!hasAccess('dashboard')) return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post('/meetings', form);
    setForm({ title: '', date: '', time: '10:00', location: '', participants: 5, description: '' });
    refresh();
  }
  async function setStatus(id: string, status: string) { await api.put(`/meetings/${id}`, { status }); refresh(); }
  async function remove(id: string) { await api.delete(`/meetings/${id}`); refresh(); }

  return (
    <div>
      <h2>Réunions</h2>
      {canWrite && (
        <form onSubmit={create} className="card" style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
          <div className="form-row"><label>Titre</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-row"><label>Date</label><input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="form-row"><label>Heure</label><input className="input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
          <div className="form-row"><label>Lieu</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <button className="btn btn-accent">Ajouter</button>
        </form>
      )}
      <div className="grid grid-2">
        {list.map((m) => (
          <div key={m.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontWeight: 700 }}>{m.title}</div><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{m.date} · {m.time} · {m.location}</div></div>
              <span className="pill pill-warn">{m.status}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{m.description}</p>
            {canWrite && (
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="select" value={m.status} onChange={(e) => setStatus(m.id, e.target.value)}>
                  <option value="upcoming">À venir</option><option value="ongoing">En cours</option><option value="done">Terminée</option><option value="cancelled">Annulée</option>
                </select>
                <button className="btn btn-ghost" onClick={() => remove(m.id)}>Supprimer</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
