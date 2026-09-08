import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { email: 'camille.dubois@eclipse-ce.fr', label: 'Camille Dubois — Admin CE' },
  { email: 'yanis.haddad@eclipse-ce.fr', label: 'Yanis Haddad — Collaborateur CE (Paiement + Dashboard)' },
  { email: 'lina.moreau@eclipse-ce.fr', label: 'Lina Moreau — Salariée' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState('eclipse2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>🌑 ECLIPSE</h1>
        <p>Connexion à votre espace CE</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>
            <select className="select" value={email} onChange={(e) => setEmail(e.target.value)}>
              {DEMO_ACCOUNTS.map((a) => <option key={a.email} value={a.email}>{a.label}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Mot de passe</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <p className="hint">
          Comptes de démonstration seedés côté serveur (mot de passe : <code>eclipse2026</code>).
          Cette authentification est réelle (JWT + bcrypt) : vous pouvez créer vos propres utilisateurs
          via le module Utilisateurs une fois connecté en Admin.
        </p>
      </div>
    </div>
  );
}
