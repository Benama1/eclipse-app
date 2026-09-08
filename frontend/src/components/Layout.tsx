import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { group: 'Général', items: [{ to: '/', label: 'Dashboard', roles: ['admin', 'collab', 'employee'] }] },
  { group: 'Finances', items: [
    { to: '/savings', label: 'Épargne', roles: ['admin', 'collab', 'employee'] },
    { to: '/payments', label: 'Paiements', roles: ['admin', 'collab', 'employee'], perm: 'payment' },
    { to: '/transactions', label: 'Transactions', roles: ['admin', 'collab', 'employee'], perm: 'payment' },
  ]},
  { group: 'Communication', items: [
    { to: '/chat', label: 'Chat CE', roles: ['admin', 'collab', 'employee'] },
    { to: '/meetings', label: 'Réunions', roles: ['admin', 'collab', 'employee'], perm: 'dashboard' },
    { to: '/offers', label: 'Offres', roles: ['admin', 'collab', 'employee'], perm: 'dashboard' },
    { to: '/communications', label: 'Communications', roles: ['admin', 'collab', 'employee'], perm: 'dashboard' },
    { to: '/documents', label: 'Documents', roles: ['admin', 'collab', 'employee'], perm: 'dashboard' },
  ]},
  { group: 'Administration', items: [
    { to: '/screens', label: 'Écrans TV', roles: ['admin'] },
    { to: '/outlook', label: 'Outlook', roles: ['admin'] },
    { to: '/users', label: 'Utilisateurs', roles: ['admin'] },
  ]},
];

export default function Layout() {
  const { user, logout, hasAccess } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">🌑 ECLIPSE</div>
        <nav>
          {NAV.map((g) => {
            const visible = g.items.filter((it) => it.roles.includes(user.role) && (!it.perm || hasAccess(it.perm as any)));
            if (!visible.length) return null;
            return (
              <div key={g.group}>
                <div className="group-label">{g.group}</div>
                {visible.map((it) => (
                  <NavLink key={it.to} to={it.to} end={it.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                    {it.label}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="foot">
          <div style={{ fontWeight: 700 }}>{user.firstname} {user.lastname}</div>
          <div style={{ opacity: .6 }}>{user.role === 'admin' ? 'Admin CE' : user.role === 'collab' ? 'Collaborateur CE' : 'Salarié'}</div>
          <button className="btn btn-ghost" style={{ marginTop: 10, width: '100%', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
            onClick={() => { logout(); navigate('/login'); }}>Déconnexion</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar"><h1>ECLIPSE</h1></header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
