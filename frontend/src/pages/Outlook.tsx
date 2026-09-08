import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Outlook() {
  const { user } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [realAuth, setRealAuth] = useState<{ ready: boolean; url?: string; message?: string } | null>(null);

  function refresh() {
    api.get('/outlook').then((r) => setConfig(r.data));
    api.get('/outlook/connect').then((r) => setRealAuth(r.data));
  }
  useEffect(refresh, []);

  if (user?.role !== 'admin') return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function toggleSimulation() { await api.post('/outlook/toggle-simulation'); refresh(); }

  return (
    <div>
      <h2>Intégration Outlook</h2>
      <div className="locked" style={{ marginBottom: 16 }}>
        ℹ️ Ceci est une préparation d'intégration réelle. Tant qu'aucune application Microsoft n'est enregistrée
        (variables MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET / MS_REDIRECT_URI dans le .env du backend),
        le module reste en simulation — comme dans le prototype V1.
      </div>
      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📧</div>
          <div>
            <div style={{ fontWeight: 700 }}>Microsoft 365</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
              {config?.connected ? 'Connecté (simulation)' : 'Non connecté'}
            </div>
          </div>
        </div>

        {realAuth?.ready ? (
          <a className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }} href={realAuth.url} target="_blank" rel="noreferrer">
            Se connecter avec Microsoft (OAuth réel)
          </a>
        ) : (
          <>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={toggleSimulation}>
              {config?.connected ? 'Déconnecter (simulation)' : 'Connecter (simulation)'}
            </button>
            {realAuth?.message && <p className="hint">{realAuth.message}</p>}
          </>
        )}
      </div>
    </div>
  );
}
