import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const DOT: Record<string, string> = { active: '#2F9E6E', offline: '#8A8FAE', maintenance: '#D99A34' };

export default function Screens() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', location: '' });

  function refresh() { api.get('/screens').then((r) => setList(r.data)); }
  useEffect(refresh, []);

  if (user?.role !== 'admin') return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await api.post('/screens', form);
    setForm({ name: '', location: '' });
    refresh();
  }
  async function setStatus(id: string, status: string) { await api.put(`/screens/${id}`, { status }); refresh(); }
  async function remove(id: string) { await api.delete(`/screens/${id}`); refresh(); }

  return (
    <div>
      <h2>Écrans TV / Android TV</h2>
      <form onSubmit={create} className="card" style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'end' }}>
        <div className="form-row" style={{ flex: 1 }}><label>Nom</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="form-row" style={{ flex: 1 }}><label>Emplacement</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <button className="btn btn-accent">Ajouter</button>
      </form>
      <div className="grid grid-3">
        {list.map((s) => (
          <div key={s.id} className="card">
            <div style={{
              aspectRatio: '16/9', borderRadius: 10, marginBottom: 10, position: 'relative',
              background: 'linear-gradient(160deg,#232D57,#33417A)', color: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            }}>
              <div style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: '50%', background: DOT[s.status] }} />
              <div style={{ fontSize: 24, marginBottom: 4 }}>📺</div>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: 11, opacity: .75 }}>{s.content}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{s.location}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginBottom: 10 }}>
              Dernière connexion : {s.lastSeen ? new Date(s.lastSeen).toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 10, wordBreak: 'break-all' }}>
              Jeton d'appairage (QR) : <code>{s.pairingToken}</code>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="select" value={s.status} onChange={(e) => setStatus(s.id, e.target.value)}>
                <option value="active">Actif</option><option value="offline">Hors ligne</option><option value="maintenance">En maintenance</option>
              </select>
              <button className="btn btn-ghost" onClick={() => remove(s.id)}>Supprimer</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p style={{ color: 'var(--ink-soft)' }}>Aucun écran enregistré.</p>}
      </div>
    </div>
  );
}
