import { useEffect, useState } from 'react';

const statuses = [
  'Pendiente', 'Por grabar', 'Pendiente de horario', 'Por validar en parrilla', 'Por confirmar',
  'Insumos recibidos', 'Grabado', 'En proceso', 'Confirmado',
  'Listo para salir', 'Arte publicado', 'Publicado',
  'Emitido', 'Transmitido', 'Por subir'
];

export default function Admin({ catalog }) {
  const [state, setState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/radio-planner-state.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => setState(data))
      .catch(() => setMessage('Error cargando estado.'));
  }, []);

  if (!state) return <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
    <div className="badge">Autenticando consola administrativa...</div>
  </div>;

  const handleChangeProgram = (id, field, value) => {
    setState(s => ({
      ...s,
      programs: {
        ...s.programs,
        [id]: {
          ...s.programs[id],
          [field]: value
        }
      }
    }));
  };

  const handleChangePodcast = (id, field, value) => {
    setState(s => ({
      ...s,
      podcasts: {
        ...s.podcasts,
        [id]: {
          ...s.podcasts[id],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const copy = { ...state, updatedAt: new Date().toISOString() };
      const res = await fetch('/api/save-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy)
      });
      if (res.ok) {
        setMessage('Configuración actualizada con éxito.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error crítico: No se pudo guardar en el servidor.');
      }
    } catch (e) {
      setMessage('Error de red: Conexión fallida.');
    }
    setSaving(false);
  };

  const catalogPrograms = Object.values(catalog.schedule).flat();

  return (
    <div className="wrap" style={{ maxWidth: 1000 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, borderBottom: '1px solid var(--line)', paddingBottom: 20 }}>
        <div>
          <span className="badge" style={{ marginBottom: 10 }}>MODO ADMINISTRADOR</span>
          <h1 style={{ fontSize: '32px' }}>Consola Operativa</h1>
        </div>
        <a href="#" className="badge" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>← VOLVER AL DASHBOARD</a>
      </header>
      
      {message && (
        <div style={{ 
          background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
          color: message.includes('Error') ? 'var(--error)' : 'var(--success)', 
          padding: '16px', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: 30,
          border: `1px solid ${message.includes('Error') ? 'var(--error)' : 'var(--success)'}`,
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <section className="section">
        <div className="section-title"><span className="dot"></span><h2>Programación Semanal</h2></div>
        <div className="panel list" style={{ gap: '16px' }}>
          {catalogPrograms.map(p => {
            const current = state.programs[p.id] || { status: 'Pendiente', note: '' };
            return (
              <div key={p.id} className="item" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <strong>{p.title}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>ID: {p.id}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                  <select 
                    value={current.status} 
                    onChange={e => handleChangeProgram(p.id, 'status', e.target.value)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '1px solid var(--line)',
                      cursor: 'pointer'
                    }}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input 
                    type="text" 
                    value={current.note || ''} 
                    onChange={e => handleChangeProgram(p.id, 'note', e.target.value)}
                    placeholder="Agregar nota de producción..."
                    style={{ 
                      padding: '10px', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '1px solid var(--line)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-title"><span className="dot"></span><h2>Distribución de Podcasts</h2></div>
        <div className="panel list" style={{ gap: '16px' }}>
          {Object.entries(catalog.podcasts).map(([id, meta]) => {
            const current = state.podcasts[id] || { status: 'Pendiente', note: '' };
            return (
              <div key={id} className="item" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <strong>{meta.title}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>ID: {id}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                  <select 
                    value={current.status} 
                    onChange={e => handleChangePodcast(id, 'status', e.target.value)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '1px solid var(--line)',
                      cursor: 'pointer'
                    }}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input 
                    type="text" 
                    value={current.note || ''} 
                    onChange={e => handleChangePodcast(id, 'note', e.target.value)}
                    placeholder="Nota de distribución..."
                    style={{ 
                      padding: '10px', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '1px solid var(--line)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid-2 section">
        <section>
          <div className="section-title"><span className="dot"></span><h2>Gestión de Alertas</h2></div>
          <textarea 
            style={{ 
              width: '100%', height: 120, padding: 15, borderRadius: 'var(--radius-md)', 
              background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--line)', 
              fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6
            }}
            placeholder="Escriba una alerta por línea..."
            value={(state.alerts || []).join('\n')}
            onChange={e => setState({ ...state, alerts: e.target.value.split('\n').filter(Boolean) })}
          />
        </section>

        <section>
          <div className="section-title"><span className="dot"></span><h2>Siguientes Pasos</h2></div>
          <textarea 
            style={{ 
              width: '100%', height: 120, padding: 15, borderRadius: 'var(--radius-md)', 
              background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--line)', 
              fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6
            }}
            placeholder="Escriba una acción por línea..."
            value={(state.nextActions || []).join('\n')}
            onChange={e => setState({ ...state, nextActions: e.target.value.split('\n').filter(Boolean) })}
          />
        </section>
      </div>

      <div style={{ position: 'sticky', bottom: 40, marginTop: 60, display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="primary"
          style={{ width: '100%', maxWidth: 400, padding: '16px', fontSize: '16px' }}
        >
          {saving ? 'PROCESANDO CAMBIOS...' : 'GUARDAR Y PUBLICAR DASHBOARD'}
        </button>
      </div>

      <div style={{ height: 100 }}></div>
    </div>
  );
}
