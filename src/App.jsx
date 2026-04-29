import { useEffect, useState } from 'react';
import './App.css';
import { catalog } from './catalog';
import Admin from './Admin';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const statusClass = (value) => 'status-' + String(value || '').toLowerCase().replaceAll(' ', '-');

function App() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(false);
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "system", "state"), async (docSnap) => {
      if (docSnap.exists()) {
        setState(docSnap.data());
        setError(false);
      } else {
        try {
          const res = await fetch('/radio-planner-state.json?v=' + Date.now(), { cache: 'no-store' });
          const data = await res.json();
          setState(data);
          setError(false);
        } catch (err) {
          setError(true);
        }
      }
    }, (err) => {
      console.error(err);
      setError(true);
    });

    return () => unsub();
  }, [route]);

  if (route === '#admin') {
    return <Admin catalog={catalog} />;
  }

  if (error) {
    return <div style={{ padding: '80px', color: 'white', textAlign: 'center', fontFamily: 'var(--font-main)' }}>
      <h2>Error de conexión</h2>
      <p>No se pudo cargar el centro de control operativo.</p>
    </div>;
  }

  if (!state) {
    return <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="badge">Cargando inteligencia operativa...</div>
    </div>;
  }

  // Derived computations
  const programs = Object.values(catalog.schedule).flat();
  const programState = state.programs || {};
  const podcastState = state.podcasts || {};
  
  const emittedCount = programs.filter(p => {
    const s = (programState[p.id]?.status || '').toLowerCase();
    return s === 'emitido' || s === 'transmitido' || s === 'publicado';
  }).length;
  
  const readyCount = programs.filter(p => {
    const s = (programState[p.id]?.status || '').toLowerCase();
    return s === 'listo para salir' || s === 'arte publicado' || s === 'confirmado';
  }).length;
  
  const inputsCount = programs.filter(p => {
    const s = (programState[p.id]?.status || '').toLowerCase();
    return s === 'insumos recibidos' || s === 'en proceso';
  }).length;
  
  const podcastsPublished = Object.values(podcastState).filter(p => p.status === 'Publicado').length;

  const firstMonday = new Date((state.calendar?.firstMonday) || '2026-04-20T00:00:00');
  const launchNote = state.calendar?.note || 'Inicio de programación pendiente.';
  const days = [
    { key: 'lunes', label: 'Lunes', offset: 0 },
    { key: 'martes', label: 'Martes', offset: 1 },
    { key: 'miercoles', label: 'Miércoles', offset: 2 },
    { key: 'jueves', label: 'Jueves', offset: 3 },
    { key: 'viernes', label: 'Viernes', offset: 4 }
  ];

  const pendingById = Object.fromEntries((state.pendingPrograms || []).map(item => [item.id, item]));

  return (
    <div className="wrap">
      <header className="hero">
        <div className="hero-top">
          <span className="badge">⚡ Gestionado por Backstage AI</span>
          <span className="badge">
            🕒 Sincronizado: {new Date(state.updatedAt).toLocaleString('es-EC', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
          </span>
          <span className="badge version-badge">PRO v2.0</span>
        </div>
        <h1>Radio UTPL Dashboard</h1>
        <p className="subtitle">
          Plataforma de gestión operativa de Radio UTPL. Control en tiempo real de parrilla semanal, producción de programas y distribución de podcasts.
        </p>
        
        <div className="stats">
          <div className="stat">
            <div className="label">Total Parrilla</div>
            <div className="value">{programs.length}</div>
          </div>
          <div className="stat">
            <div className="label">En Producción</div>
            <div className="value">{inputsCount}</div>
          </div>
          <div className="stat">
            <div className="label">Listos / Arte</div>
            <div className="value">{readyCount}</div>
          </div>
          <div className="stat">
            <div className="label">Emitidos (Histórico)</div>
            <div className="value">{state.totalEmitted ?? emittedCount ?? 0}</div>
          </div>
          <div className="stat">
            <div className="label">Podcasts</div>
            <div className="value">{podcastsPublished}</div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="section-title">
          <span className="dot"></span>
          <h2>Calendario de Lanzamiento</h2>
        </div>
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
            <span>📝</span>
            <p className="small" style={{ margin: 0 }}>{launchNote}</p>
          </div>
          <div className="schedule">
            {days.map((day, idx) => {
              const d = new Date(firstMonday);
              d.setDate(d.getDate() + day.offset);
              const formatted = d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' });
              const shows = catalog.schedule[day.key] || [];

              return (
                <div key={idx} className="day">
                  <h3>{day.label} <span style={{ opacity: 0.4, fontSize: '14px', fontWeight: 400 }}>{formatted}</span></h3>
                  {shows.length > 0 ? shows.map((item, idxx) => (
                    <div key={idxx} className="card" style={{ padding: '12px', borderStyle: 'dashed' }}>
                      <div className="time">{item.time}</div>
                      <div className="title" style={{ fontSize: '15px' }}>{item.title}</div>
                    </div>
                  )) : <div className="meta">Sin programas fijos.</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span className="dot"></span>
          <h2>Estado Operativo de Parrilla</h2>
        </div>
        <div className="schedule">
          {Object.entries(catalog.schedule).map(([dayKey, items], idx) => (
            <div key={idx} className="day">
              <h3>{days.find(d => d.key === dayKey)?.label}</h3>
              {items.length > 0 ? items.map((item, idxx) => {
                const current = state.programs[item.id] || pendingById[item.id] || { status: 'Pendiente', note: '' };
                return (
                  <div key={idxx} className="card">
                    <div className="time">{item.time}</div>
                    <div className="title">{item.title}</div>
                    <div className="meta"><strong>{item.area}</strong></div>
                    <div className="chips">
                      {item.tags.map((tag, iidx) => <span key={iidx} className="chip">{tag}</span>)}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <span className={`status-pill ${statusClass(current.status)}`}>{current.status}</span>
                    </div>
                    {current.emittedDate && <div className="meta" style={{ marginTop: '8px' }}>📅 Emitido: {current.emittedDate}</div>}
                    {current.link && <div className="meta" style={{ marginTop: '4px' }}>🔗 <a href={current.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 'bold' }}>Acceder al Programa</a></div>}
                    {current.note && <div className="status-note">{current.note}</div>}
                  </div>
                );
              }) : (
                <div className="card" style={{ opacity: 0.5 }}>
                  <div className="title">Espacio Disponible</div>
                  <div className="meta">Bloque libre para reajustes.</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid-2 section">
        <section>
          <div className="section-title">
            <span className="dot"></span>
            <h2>Alertas Prioritarias</h2>
          </div>
          <div className="list">
            {(state.alerts || []).map((alert, idx) => (
              <div key={idx} className="item">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--warning)' }}>⚠️</span>
                  <div className="small" style={{ color: '#fff' }}>{alert}</div>
                </div>
              </div>
            ))}
            {!(state.alerts?.length > 0) && <div className="item"><div className="small">Sistema operando sin incidencias.</div></div>}
          </div>
        </section>

        <section>
          <div className="section-title">
            <span className="dot"></span>
            <h2>Próximos Hitos</h2>
          </div>
          <div className="list">
            {(state.nextActions || []).map((action, idx) => (
              <div key={idx} className="item">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-light)' }}>🎯</span>
                  <div className="small" style={{ color: '#fff' }}>{action}</div>
                </div>
              </div>
            ))}
            {!(state.nextActions?.length > 0) && <div className="item"><div className="small">Hitos semanales completados.</div></div>}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-title">
          <span className="dot"></span>
          <h2>Producción de Podcasts</h2>
        </div>
        <div className="schedule">
           {Object.entries(state.podcasts || {}).map(([id, item], idx) => {
              const meta = catalog.podcasts[id] || { title: id, area: '' };
              return (
                <div key={idx} className="card" style={{ minWidth: '280px' }}>
                  <div className="title">{meta.title}</div>
                  <div className="meta"><strong>{meta.area}</strong></div>
                  <div style={{ marginTop: '16px' }}>
                    <span className={`status-pill ${statusClass(item.status)}`}>{item.status}</span>
                  </div>
                  {item.note && <div className="status-note">{item.note}</div>}
                </div>
              );
            })}
        </div>
      </section>

      <footer className="footer">
        <p>Radio UTPL Operating System · Gestionado por Backstage AI</p>
        <div style={{ marginTop: '12px' }}>
          <a href="#admin" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>ACCESO ADMINISTRATIVO</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
