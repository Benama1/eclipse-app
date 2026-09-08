import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<string[]>(['general', 'support', 'annonces']);
  const [active, setActive] = useState('general');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Chargement de la liste des canaux existants (REST) — indépendant du websocket
  useEffect(() => {
    api.get('/chat/channels').then((r) => { if (r.data?.length) setChannels(r.data); }).catch(() => {});
  }, []);

  // Connexion Socket.io — TOUS les rôles (Admin / Collaborateur / Salarié) ont
  // le droit de lire et d'écrire dans le Chat (seule exception à la règle
  // "lecture seule sauf Admin"), voir ChatGateway côté backend.
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    const token = localStorage.getItem('eclipse_token');
    const socket = io(`${wsUrl}/chat`, { auth: { token } });
    socketRef.current = socket;

    socket.on('history', (hist: any[]) => setMessages(hist));
    socket.on('message', (msg: any) => setMessages((prev) => [...prev, msg]));
    socket.emit('join', active);

    return () => { socket.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Changement de canal : on rejoint le nouveau canal (réinitialise l'historique via l'event 'history')
  useEffect(() => {
    socketRef.current?.emit('join', active);
    setMessages([]);
  }, [active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    socketRef.current?.emit('message', { channel: active, text });
    setText('');
  }

  const myName = user ? `${user.firstname} ${user.lastname}` : '';

  return (
    <div>
      <h2>Chat CE</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>Temps réel (Socket.io) — accessible en lecture et écriture à tous les rôles.</p>
      <div className="chat-wrap">
        <div className="chat-channels">
          {channels.map((c) => (
            <div key={c} className={`chat-chan ${c === active ? 'active' : ''}`} onClick={() => setActive(c)}># {c}</div>
          ))}
        </div>
        <div className="chat-main">
          <div className="chat-msgs" ref={scrollRef}>
            {messages.map((m) => (
              <div key={m._id || m.id} className={`chat-msg ${m.user === myName ? 'mine' : ''}`}>
                <div className="bubble">{m.text}</div>
                <div className="meta">{m.user} · {new Date(m.createdAt || Date.now()).toLocaleTimeString()}</div>
              </div>
            ))}
            {messages.length === 0 && <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Aucun message pour le moment.</p>}
          </div>
          <form className="chat-input" onSubmit={send}>
            <input className="input" placeholder="Écrivez un message…" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn btn-primary">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
