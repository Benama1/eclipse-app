import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const DOC_ICON: Record<string, string> = {
  pdf: '📕', word: '📘', excel: '📗', powerpoint: '📙', image: '🖼️', text: '📄', csv: '📊', zip: '🗜️', other: '📄',
};

export default function Documents() {
  const { canWrite, hasAccess } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [category, setCategory] = useState('Général');
  const [uploading, setUploading] = useState(false);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  function refresh() { api.get('/documents').then((r) => setList(r.data)); }
  useEffect(refresh, []);

  // Le téléchargement passe par une route protégée par JWT (backend inchangé) :
  // impossible d'utiliser une <img src="..."> ou un <a href="..."> classique,
  // il faut donc récupérer le fichier via axios (avec le token) puis créer une URL locale.
  useEffect(() => {
    const images = list.filter((d) => d.type === 'image' && !thumbs[d.id]);
    if (!images.length) return;
    let cancelled = false;
    images.forEach(async (d) => {
      try {
        const res = await api.get(`/documents/${d.id}/download`, { responseType: 'blob' });
        if (cancelled) return;
        const url = URL.createObjectURL(res.data);
        setThumbs((prev) => ({ ...prev, [d.id]: url }));
      } catch { /* aperçu indisponible (ex: droits insuffisants) */ }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  async function openDoc(id: string, name: string) {
    const res = await api.get(`/documents/${id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  if (!hasAccess('dashboard')) return <div className="locked">🔒 Vous n'avez pas accès à ce module.</div>;

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    setUploading(true);
    try {
      await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (fileRef.current) fileRef.current.value = '';
      setCategory('Général');
      refresh();
    } finally {
      setUploading(false);
    }
  }
  async function remove(id: string) { await api.delete(`/documents/${id}`); refresh(); }

  return (
    <div>
      <h2>Documents</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
        Les fichiers sont réellement téléversés et stockés sur le serveur (voir DocumentsStorage — driver local, prêt pour un driver S3).
      </p>
      {canWrite && (
        <form onSubmit={upload} className="card" style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-row" style={{ flex: 1, minWidth: 220 }}>
            <label>Fichier</label>
            <input ref={fileRef} className="input" type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,image/*" />
          </div>
          <div className="form-row">
            <label>Catégorie</label>
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <button className="btn btn-accent" disabled={uploading}>{uploading ? 'Envoi…' : 'Téléverser'}</button>
        </form>
      )}
      <div className="grid grid-3">
        {list.map((d) => (
          <div key={d.id} className="card" style={{ display: 'flex', gap: 12 }}>
            {d.type === 'image' && thumbs[d.id] ? (
              <img src={thumbs[d.id]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flex: 'none' }} />
            ) : (
              <div style={{ fontSize: 26, flex: 'none' }}>{DOC_ICON[d.type] || '📄'}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', margin: '4px 0 8px' }}>{d.category} · {d.sizeLabel} · {d.date}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => openDoc(d.id, d.name)}>Ouvrir</button>
                {canWrite && <button className="btn btn-ghost" onClick={() => remove(d.id)}>Supprimer</button>}
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p style={{ color: 'var(--ink-soft)' }}>Aucun document pour le moment.</p>}
      </div>
    </div>
  );
}
