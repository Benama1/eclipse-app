import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const METHOD_ICON: Record<string, string> = { Carte: '💳', 'Prélèvement': '🏦', Virement: '🏛️', Wero: '📱' };

export default function Transactions() {
  const { hasAccess } = useAuth();
  const [tx, setTx] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');

  function refresh() {
    api.get('/transactions', { params: { q: q || undefined, status: status || undefined, method: method || undefined } })
      .then((r) => setTx(r.data));
  }
  useEffect(refresh, [q, status, method]);

  if (!hasAccess('payment')) return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  return (
    <div>
      <h2>Transactions</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <input className="input" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Statut : Tous</option><option value="paid">Payé</option><option value="pending">En attente</option><option value="failed">Échoué</option>
        </select>
        <select className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">Mode : Tous</option><option>Carte</option><option>Prélèvement</option><option>Virement</option><option>Wero</option>
        </select>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Utilisateur</th><th>Type</th><th>Montant</th><th>Mode</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {tx.map((t) => (
              <tr key={t.id}>
                <td>{t.user}</td><td>{t.type}</td><td>{Number(t.amount).toLocaleString()} €</td>
                <td>{METHOD_ICON[t.method] || '💳'} {t.method}</td>
                <td><span className={`pill pill-${t.status === 'paid' ? 'success' : t.status === 'pending' ? 'warn' : 'danger'}`}>{t.status}</span></td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
