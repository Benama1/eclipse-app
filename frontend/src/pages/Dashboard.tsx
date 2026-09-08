import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Dashboard() {
  const { user } = useAuth();
  const [savings, setSavings] = useState<any>({ objective: 1, current: 0 });
  const [contributions, setContributions] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [tx, setTx] = useState<any[]>([]);

  useEffect(() => {
    api.get('/savings').then((r) => setSavings(r.data));
    api.get('/contributions').then((r) => setContributions(r.data));
    api.get('/meetings').then((r) => setMeetings(r.data)).catch(() => {});
    api.get('/transactions').then((r) => setTx(r.data.slice(0, 6)));
  }, []);

  const percent = Math.min(100, Math.round((savings.current / (savings.objective || 1)) * 100));
  let running = 0;
  const chartData = {
    labels: contributions.map((c) => c.date),
    datasets: [{
      data: contributions.map((c) => (running += Number(c.amount))),
      borderColor: '#D99A34', backgroundColor: 'rgba(217,154,52,.18)', fill: true, tension: .35, pointRadius: 0,
    }],
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p style={{ color: 'var(--ink-soft)' }}>Bienvenue {user?.firstname}, vue d'ensemble de l'activité du CE.</p>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="stat-label">Épargne actuelle</div>
          <div className="stat-val">{Number(savings.current).toLocaleString()} €</div>
        </div>
        <div className="card">
          <div className="stat-label">Objectif</div>
          <div className="stat-val">{Number(savings.objective).toLocaleString()} €</div>
        </div>
        <div className="card">
          <div className="stat-label">Progression</div>
          <div className="stat-val">{percent}%</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ background: 'linear-gradient(160deg,#FDEBF3,#FBDDEC)' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Progression de l'épargne</div>
          <Line data={chartData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} height={140} />
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Réunions à venir</div>
          {meetings.filter((m) => m.status === 'upcoming').length === 0 && <p style={{ color: 'var(--ink-soft)' }}>Aucune réunion à venir.</p>}
          {meetings.filter((m) => m.status === 'upcoming').map((m) => (
            <div key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{m.date} · {m.time} · {m.location}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Transactions récentes</div>
        <table>
          <thead><tr><th>Utilisateur</th><th>Type</th><th>Montant</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {tx.map((t) => (
              <tr key={t.id}><td>{t.user}</td><td>{t.type}</td><td>{Number(t.amount).toLocaleString()} €</td>
                <td><span className={`pill pill-${t.status === 'paid' ? 'success' : t.status === 'pending' ? 'warn' : 'danger'}`}>{t.status}</span></td>
                <td>{t.date}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
