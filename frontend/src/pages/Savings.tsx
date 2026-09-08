import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Savings() {
  const { canWrite } = useAuth();
  const [savings, setSavings] = useState<any>({ objective: 1, current: 0 });
  const [contributions, setContributions] = useState<any[]>([]);
  const [amount, setAmount] = useState(50);
  const [user, setUser] = useState('');
  const [objInput, setObjInput] = useState(0);
  const [curInput, setCurInput] = useState(0);

  function refresh() {
    api.get('/savings').then((r) => { setSavings(r.data); setObjInput(r.data.objective); setCurInput(r.data.current); });
    api.get('/contributions').then((r) => setContributions(r.data.slice().reverse()));
  }
  useEffect(refresh, []);

  const percent = Math.min(100, Math.round((savings.current / (savings.objective || 1)) * 100));

  async function addContribution(e: React.FormEvent) {
    e.preventDefault();
    if (!user.trim()) return;
    await api.post('/contributions', { user, amount: Number(amount) });
    setUser(''); setAmount(50);
    refresh();
  }
  async function saveObjective(e: React.FormEvent) {
    e.preventDefault();
    await api.put('/savings', { objective: Number(objInput), current: Number(curInput) });
    refresh();
  }

  return (
    <div>
      <h2>Épargne / Débrayage</h2>
      <div className="grid grid-4" style={{ margin: '16px 0' }}>
        <div className="card"><div className="stat-label">Objectif</div><div className="stat-val">{Number(savings.objective).toLocaleString()} €</div></div>
        <div className="card"><div className="stat-label">Montant actuel</div><div className="stat-val">{Number(savings.current).toLocaleString()} €</div></div>
        <div className="card"><div className="stat-label">Pourcentage</div><div className="stat-val">{percent}%</div></div>
        <div className="card"><div className="stat-label">Restant</div><div className="stat-val">{Math.max(0, savings.objective - savings.current).toLocaleString()} €</div></div>
      </div>

      <div className="grid grid-2">
        {canWrite && (
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Modifier l'objectif (Admin)</div>
            <form onSubmit={saveObjective}>
              <div className="form-row"><label>Objectif (€)</label><input className="input" type="number" value={objInput} onChange={(e) => setObjInput(Number(e.target.value))} /></div>
              <div className="form-row"><label>Montant actuel (€)</label><input className="input" type="number" value={curInput} onChange={(e) => setCurInput(Number(e.target.value))} /></div>
              <button className="btn btn-primary">Enregistrer</button>
            </form>
            <hr style={{ margin: '18px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Ajouter une contribution</div>
            <form onSubmit={addContribution}>
              <div className="form-row"><label>Utilisateur</label><input className="input" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nom Prénom" /></div>
              <div className="form-row"><label>Montant (€)</label><input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
              <button className="btn btn-accent">Ajouter</button>
            </form>
          </div>
        )}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Historique des contributions</div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            <table><thead><tr><th>Utilisateur</th><th>Montant</th><th>Date</th></tr></thead>
              <tbody>{contributions.map((c) => <tr key={c.id}><td>{c.user}</td><td>{Number(c.amount).toLocaleString()} €</td><td>{c.date}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
