import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const METHOD_ICON: Record<string, string> = { Carte: '💳', 'Prélèvement': '🏦', Virement: '🏛️', Wero: '📱' };

export default function Payments() {
  const { user, canWrite, hasAccess } = useAuth();
  const [tx, setTx] = useState<any[]>([]);
  const [bank, setBank] = useState<any>(null);
  const [payUser, setPayUser] = useState(user ? `${user.firstname} ${user.lastname}` : '');
  const [amount, setAmount] = useState(50);
  const [method, setMethod] = useState('Carte');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');

  function refresh() {
    api.get('/transactions').then((r) => setTx(r.data.filter((t: any) => t.type !== 'Épargne')));
    if (user?.role === 'admin') api.get('/bank').then((r) => setBank(r.data));
  }
  useEffect(refresh, []);

  if (!hasAccess('payment')) return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/payments', { user: payUser, amount: Number(amount), method });
    refresh();
  }
  async function saveBank(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/bank/configure', { bankName, ibanLast4: iban });
    setBankName(''); setIban('');
    refresh();
  }

  return (
    <div>
      <h2>Paiements</h2>

      {user?.role === 'admin' && (
        <div className="card" style={{ maxWidth: 560, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>🏦 Compte bancaire du CE</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
            Préparation de la connexion réelle (Open Banking / PSD2). Aucune donnée bancaire sensible n'est stockée ici.
          </p>
          {bank && (
            <div style={{ marginBottom: 10 }}>
              <span className={`pill ${bank.connected ? 'pill-success' : 'pill-muted'}`}>
                {bank.connected ? `${bank.bankName} · IBAN •••• ${bank.ibanLast4}` : 'Non configuré'}
              </span>
            </div>
          )}
          <form onSubmit={saveBank} style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Nom banque" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            <input className="input" placeholder="4 derniers chiffres IBAN" maxLength={4} value={iban} onChange={(e) => setIban(e.target.value)} />
            <button className="btn btn-ghost">Enregistrer</button>
          </form>
        </div>
      )}

      {canWrite && (
        <div className="card" style={{ maxWidth: 480, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Nouveau paiement</div>
          <form onSubmit={submitPayment}>
            <div className="form-row"><label>Utilisateur</label><input className="input" value={payUser} onChange={(e) => setPayUser(e.target.value)} /></div>
            <div className="form-row"><label>Montant (€)</label><input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
            <div className="form-row"><label>Mode</label>
              <select className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>Carte</option><option>Prélèvement</option><option>Virement</option><option>Wero</option>
              </select>
            </div>
            <button className="btn btn-accent">Payer (simulation)</button>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead><tr><th>Utilisateur</th><th>Référence</th><th>Montant</th><th>Mode</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {tx.map((t) => (
              <tr key={t.id}>
                <td>{t.user}</td><td>{t.reference}</td><td>{Number(t.amount).toLocaleString()} €</td>
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
