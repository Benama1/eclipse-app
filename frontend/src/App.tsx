import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Payments from './pages/Payments';
import Transactions from './pages/Transactions';
import Chat from './pages/Chat';
import Meetings from './pages/Meetings';
import Offers from './pages/Offers';
import Communications from './pages/Communications';
import Documents from './pages/Documents';
import Screens from './pages/Screens';
import Outlook from './pages/Outlook';
import Users from './pages/Users';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="savings" element={<Savings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="chat" element={<Chat />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="offers" element={<Offers />} />
        <Route path="communications" element={<Communications />} />
        <Route path="documents" element={<Documents />} />
        <Route path="screens" element={<Screens />} />
        <Route path="outlook" element={<Outlook />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
