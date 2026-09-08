import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { user: me } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', role: 'employee', access: 'both', password: '' });
  const [error, setError] = useState('');

  function refresh() { api.get('/users').then((r) => setList(r.data)); }
  useEffect(refresh, []);

  if (me?.role !== 'admin') return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim()) return;
    try {
      await api.post('/users', {
        firstname: form.firstname, lastname: form.lastname, email: form.email, role: form.role,
        access: form.role === 'collab' ? form.access : undefined,
        password: form.password || undefined,
      });
      setForm({ firstname: '', lastname: '', email: '', role: 'employee', access: 'both', password: '' });
      refresh();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création');
    }
  }
  async function remove(id: string) { await api.delete(`/users/${id}`); refresh(); }

  const roleLabel = (r: string) => (r === 'admin' ? 'Admin CE' : r === 'collab' ? 'Collaborateur CE' : 'Salarié');

  return (
    <div>
      <h2>Utilisateurs</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={create} className="card" style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
        <div className="form-row"><label>Prénom</label><input className="input" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} /></div>
        <div className="form-row"><label>Nom</label><input className="input" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} /></div>
        <div className="form-row"><label>Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-row"><label>Rôle</label>
          <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="employee">Salarié</option><option value="collab">Collaborateur CE</option><option value="admin">Admin CE</option>
          </select>
        </div>
        {form.role === 'collab' ? (
          <div className="form-row"><label>Accès</label>
            <select className="select" value={form.access} onChange={(e) => setForm({ ...form, access: e.target.value })}>
              <option value="payment">Paiement</option><option value="dashboard">Dashboard</option><option value="both">Les deux</option>
            </select>
          </div>
        ) : <div />}
        <button className="btn btn-accent">Créer</button>
      </form>
      <p className="hint" style={{ marginTop: -8, marginBottom: 12 }}>
        Mot de passe par défaut si laissé vide : <code>eclipse2026</code>. L'utilisateur pourra le changer une fois connecté (fonctionnalité à ajouter côté profil).
      </p>
      <div className="card">
        <table>
          <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Accès</th><th></th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.firstname} {u.lastname}</td>
                <td>{u.email}</td>
                <td>{roleLabel(u.role)}</td>
                <td>{u.role === 'collab' ? (u.access === 'both' ? 'Paiement + Dashboard' : u.access === 'payment' ? 'Paiement' : 'Dashboard') : '—'}</td>
                <td>{u.id !== me?.id && <button className="btn btn-ghost" onClick={() => remove(u.id)}>Supprimer</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
