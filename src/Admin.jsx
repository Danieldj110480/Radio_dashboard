import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";

const statuses = [
  'Pendiente', 'Por grabar', 'Pendiente de horario', 'Por validar en parrilla', 'Por confirmar',
  'Insumos recibidos', 'Grabado', 'En proceso', 'Confirmado',
  'Listo para salir', 'Arte publicado', 'Publicado',
  'Emitido', 'Transmitido', 'Por subir'
];

export default function Admin({ catalog }) {
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [state, setState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadState() {
      try {
        const docSnap = await getDoc(doc(db, "system", "state"));
        if (docSnap.exists()) {
          setState(docSnap.data());
        } else {
          const res = await fetch('/radio-planner-state.json?v=' + Date.now());
          const data = await res.json();
          setState(data);
        }
      } catch (e) {
        setMessage('Error cargando estado de Firebase.');
      }
    }
    loadState();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError('Credenciales incorrectas.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (user === undefined) {
    return <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}><div className="badge">Verificando sesión...</div></div>;
  }

  if (user === null) {
    return (
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="panel" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2>Acceso Restringido</h2>
            <p className="small" style={{ color: 'var(--text-muted)' }}>Ingresa tus credenciales administrativas</p>
          </div>
          {authError && <div style={{ color: 'var(--error)', marginBottom: 20, textAlign: 'center', fontSize: 14 }}>{authError}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--line)' }}
                required
              />
            </div>
            <div style={{ marginBottom: 30 }}>
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--line)' }}
                required
              />
            </div>
            <button type="submit" className="primary" style={{ width: '100%', padding: '14px' }}>INGRESAR</button>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <a href="#" style={{ color: 'var(--text-muted)', fontSize: 12, textDecoration: 'none' }}>Volver al dashboard</a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!state) return <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
    <div className="badge">Autenticando consola administrativa...</div>
  </div>;

  const handleChangeProgram = (id, field, value) => {
    if (field === 'status') {
      const oldStatus = state.programs?.[id]?.status || '';
      const isEmitted = (v) => ['emitido', 'transmitido', 'publicado'].includes((v || '').toLowerCase());

      if (!isEmitted(oldStatus) && isEmitted(value)) {
        if (window.confirm(`¿Confirmar emisión y reiniciar programa para la próxima semana?\n\n- Se sumará +1 al contador histórico.\n- El enlace y la fecha quedarán guardados y visibles para el público.\n- El estado volverá a "Pendiente" para iniciar el nuevo ciclo.`)) {
          setState(s => {
            let currentTotal = s.totalEmitted;
            if (currentTotal === undefined) {
              const currentPrograms = Object.values(s.programs || {});
              currentTotal = currentPrograms.filter(p => isEmitted(p.status)).length;
            }
            return {
              ...s,
              totalEmitted: currentTotal + 1,
              programs: {
                ...s.programs,
                [id]: {
                  ...s.programs[id],
                  status: 'Pendiente', // Reiniciar estado
                  note: '', // Limpiar nota
                  emittedDate: s.programs[id]?.emittedDate || new Date().toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')
                }
              }
            };
          });
        }
        return; // Si cancela, no hacemos nada y el select vuelve a su estado anterior
      }
    }

    // Actualización normal
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
      await setDoc(doc(db, "system", "state"), copy);
      setMessage('Configuración actualizada con éxito en Firebase.');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setMessage('Error crítico: No se pudo guardar en la base de datos.');
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
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 12 }}>CERRAR SESIÓN</button>
          <a href="#" className="badge" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>← VOLVER</a>
        </div>
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

      <section className="section" style={{ marginTop: 0 }}>
        <div className="section-title"><span className="dot"></span><h2>Estadísticas Globales</h2></div>
        <div className="panel list">
          <div className="item" style={{ background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyItems: 'space-between' }}>
            <strong style={{ flex: 1, margin: 0 }}>Total Programas Emitidos (Histórico acumulado)</strong>
            <input 
              type="number" 
              value={state.totalEmitted || 0} 
              onChange={e => setState({...state, totalEmitted: parseInt(e.target.value) || 0})}
              style={{ width: '120px', textAlign: 'center' }}
            />
          </div>
        </div>
      </section>

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
                <div className="admin-list-grid">
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
                <div className="admin-list-grid" style={{ marginTop: '12px' }}>
                  <input 
                    type="date" 
                    value={current.emittedDate || ''} 
                    onChange={e => handleChangeProgram(p.id, 'emittedDate', e.target.value)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'rgba(0,0,0,0.3)', 
                      color: 'white', 
                      border: '1px solid var(--line)'
                    }}
                  />
                  <input 
                    type="text" 
                    value={current.link || ''} 
                    onChange={e => handleChangeProgram(p.id, 'link', e.target.value)}
                    placeholder="Pegar el enlace público del programa emitido..."
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
                <div className="admin-list-grid">
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
          style={{ width: '100%', maxWidth: 400, padding: '16px', fontSize: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
        >
          {saving ? 'PROCESANDO CAMBIOS...' : 'GUARDAR EN FIREBASE'}
        </button>
      </div>

      <div style={{ height: 100 }}></div>
    </div>
  );
}
