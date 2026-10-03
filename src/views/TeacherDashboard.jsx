import { useState, useEffect } from 'react';
import { Plus, Users, Send, LogOut, CheckCircle2, Clock, MessageSquare, AlertCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import AlvartLogo from '../components/AlvartLogo';

export default function TeacherDashboard({ user, onLogout }) {
  // Manejo la pestaña activa entre Tareas y Anuncios
  const [activeTab, setActiveTab] = useState('tareas'); // 'tareas' | 'anuncios'
  const [tareas, setTareas] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el modal donde creo una nueva tarea
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  // Estados para el modal donde publico un nuevo anuncio en el muro
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Estado para expandir la lista de alumnos que vieron una tarea específica
  const [expandedTask, setExpandedTask] = useState(null);

  // Estado para almacenar las respuestas a los comentarios de los anuncios
  const [replyText, setReplyText] = useState({});

  // Cargo todas las tareas y anuncios desde mi servidor
  const fetchData = async () => {
    try {
      const [resTareas, resAnuncios] = await Promise.all([
        fetch('/api/tareas').then(r => r.json()),
        fetch('/api/anuncios').then(r => r.json())
      ]);
      setTareas(resTareas);
      setAnuncios(resAnuncios);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar la información del docente:', err);
      setLoading(false);
    }
  };

  // Consulto la información al montar el componente y la refresco cada 8 segundos
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Proceso la creación de una nueva tarea para los alumnos
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate.trim()) return;

    try {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docente_id: user?.id,
          materia: user?.materia_titular || 'Redes III',
          titulo: newTitle,
          descripcion: newDesc,
          fecha_entrega: newDueDate,
          prioridad: newPriority
        })
      });

      if (res.ok) {
        setShowTaskModal(false);
        setNewTitle('');
        setNewDesc('');
        setNewDueDate('');
        fetchData();
        alert('✅ ¡Tarea publicada con éxito! Se ha notificado a todos los alumnos en su celular.');
      }
    } catch (err) {
      alert('Error al publicar tarea');
    }
  };

  // Proceso la publicación de un nuevo anuncio en el muro escolar
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    try {
      const res = await fetch('/api/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docente_id: user?.id,
          autor_nombre: user?.nombre || 'Prof. Mario Alberto Morales Z.',
          materia: user?.materia_titular || 'Redes III',
          titulo: annTitle,
          contenido: annContent
        })
      });

      if (res.ok) {
        setShowAnnModal(false);
        setAnnTitle('');
        setAnnContent('');
        fetchData();
        alert('📢 ¡Anuncio publicado en el muro escolar! Notificación enviada a los alumnos.');
      }
    } catch (err) {
      alert('Error al publicar anuncio');
    }
  };

  // Envío la respuesta del docente a un comentario de un anuncio
  const handleSendReply = async (anuncioId) => {
    const text = replyText[anuncioId];
    if (!text || !text.trim()) return;

    try {
      await fetch(`/api/anuncios/${anuncioId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user?.id,
          autor_nombre: user?.nombre || 'Prof. Mario Alberto Morales Z.',
          rol: 'docente',
          comentario: text.trim()
        })
      });

      setReplyText({ ...replyText, [anuncioId]: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="anim-fade padded-bottom" style={{ minHeight: '100%' }}>
      {/* Cabecera del Portal Docente */}
      <div style={{
        padding: '18px 20px',
        background: 'rgba(7, 11, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlvartLogo size={28} />
            <div>
              <span style={{ fontSize: '10.5px', color: '#d92121', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Portal Docente
              </span>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                Universidad Alvart
              </h2>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#ff6b6b',
              padding: '7px 12px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        </div>

        {/* Ficha descriptiva del Profesor */}
        <div style={{
          background: '#151e36',
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(217, 33, 33, 0.15)',
            border: '2px solid rgba(217, 33, 33, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '18px'
          }}>
            👨‍🏫
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {user?.nombre || 'Prof. Mario Alberto Morales Z.'}
            </h3>
            <p style={{ fontSize: '12px', color: '#9aa5c4' }}>
              Titular: <strong style={{ color: '#2f80ed' }}>{user?.materia_titular || 'Redes III'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Selector de pestañas: Tareas vs Anuncios */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          display: 'flex',
          background: '#151e36',
          borderRadius: '26px',
          padding: '4px'
        }}>
          <button
            onClick={() => setActiveTab('tareas')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '22px',
              border: 'none',
              background: activeTab === 'tareas' ? '#d92121' : 'transparent',
              color: activeTab === 'tareas' ? '#fff' : '#8b95b3',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Tareas y Entregas ({tareas.length})
          </button>
          <button
            onClick={() => setActiveTab('anuncios')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '22px',
              border: 'none',
              background: activeTab === 'anuncios' ? '#d92121' : 'transparent',
              color: activeTab === 'anuncios' ? '#fff' : '#8b95b3',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Muro de Anuncios ({anuncios.length})
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: Gestión de Tareas y confirmaciones de lectura */}
      {activeTab === 'tareas' && (
        <div style={{ padding: '18px 20px' }}>
          {/* Botón para abrir el modal de nueva tarea */}
          <button
            onClick={() => setShowTaskModal(true)}
            className="btn-primary"
            style={{ marginBottom: '18px', padding: '14px' }}
          >
            <Plus size={18} />
            <span>Subir Nueva Tarea a los Alumnos</span>
          </button>

          <h4 style={{ fontSize: '13px', color: '#8b95b3', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
            Tareas Asignadas y Control de Vistos
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tareas.map((task) => (
              <div
                key={task.id}
                style={{
                  background: '#151e36',
                  borderRadius: '18px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#2f80ed', fontWeight: 600 }}>
                    {task.materia}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    background: task.prioridad === 'Urgente' ? 'rgba(217, 33, 33, 0.2)' : 'rgba(47, 128, 237, 0.2)',
                    color: task.prioridad === 'Urgente' ? '#ff6b6b' : '#2f80ed',
                    fontWeight: 600
                  }}>
                    {task.prioridad}
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                  {task.title || task.titulo}
                </h3>

                {task.descripcion && (
                  <p style={{ fontSize: '12px', color: '#9aa5c4', marginBottom: '12px', lineHeight: 1.4 }}>
                    {task.descripcion}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8b95b3', marginBottom: '14px' }}>
                  <Clock size={14} />
                  <span>Entrega: {task.fecha_entrega}</span>
                </div>

                {/* Control de lectura: Muestro quién y cuántos alumnos abrieron la tarea */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '12px'
                }}>
                  <div
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Eye size={16} color="#34c759" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#34c759' }}>
                        {task.vistasCount > 0 ? `${task.vistasCount} alumno(s) abrieron esta tarea` : 'Ningún alumno la ha visto aún'}
                      </span>
                    </div>
                    {expandedTask === task.id ? <ChevronUp size={16} color="#8b95b3" /> : <ChevronDown size={16} color="#8b95b3" />}
                  </div>

                  {expandedTask === task.id && (
                    <div style={{
                      marginTop: '10px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: '12px',
                      padding: '10px 12px'
                    }}>
                      <span style={{ fontSize: '11px', color: '#8b95b3', display: 'block', marginBottom: '6px' }}>
                        Alumnos que han visto la publicación:
                      </span>
                      {task.vistas && task.vistas.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {task.vistas.map((v, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                              <span style={{ color: '#fff', fontWeight: 500 }}>✓ {v.estudiante_nombre}</span>
                              <span style={{ color: '#657193' }}>{v.visto_en.split(' ')[1] || 'Reciente'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '11.5px', color: '#657193', fontStyle: 'italic' }}>
                          Esperando a que los alumnos abran la app.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: Muro de Anuncios y conversación con el grupo */}
      {activeTab === 'anuncios' && (
        <div style={{ padding: '18px 20px' }}>
          <button
            onClick={() => setShowAnnModal(true)}
            className="btn-primary"
            style={{ marginBottom: '18px', padding: '14px', background: 'linear-gradient(135deg, #2f80ed 0%, #1c5fc4 100%)' }}
          >
            <Send size={18} />
            <span>Publicar Anuncio al Grupo</span>
          </button>

          <h4 style={{ fontSize: '13px', color: '#8b95b3', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
            Avisos de Clase y Respuestas de Alumnos
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {anuncios.map((ann) => (
              <div
                key={ann.id}
                style={{
                  background: '#151e36',
                  borderRadius: '18px',
                  padding: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11.5px', color: '#d92121', fontWeight: 600 }}>
                    {ann.materia}
                  </span>
                  <span style={{ fontSize: '11px', color: '#8b95b3' }}>
                    {ann.creado_en.split(' ')[0]}
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {ann.titulo}
                </h3>
                <p style={{ fontSize: '13px', color: '#dbe2f5', lineHeight: 1.5, marginBottom: '16px' }}>
                  {ann.contenido}
                </p>

                {/* Hilo interactivo de comentarios */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <MessageSquare size={14} color="#9aa5c4" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#9aa5c4' }}>
                      Respuestas ({ann.comentarios?.length || 0}):
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {ann.comentarios && ann.comentarios.length > 0 ? (
                      ann.comentarios.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: c.rol === 'docente' ? 'rgba(47, 128, 237, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            borderLeft: c.rol === 'docente' ? '3px solid #2f80ed' : '3px solid #d92121'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <strong style={{ fontSize: '12px', color: '#fff' }}>
                              {c.autor_nombre} {c.rol === 'docente' ? '(Tú)' : ''}
                            </strong>
                            <span style={{ fontSize: '10px', color: '#8b95b3' }}>
                              {c.rol === 'docente' ? 'Docente' : 'Alumno'}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#cfd7eb', margin: 0 }}>
                            {c.comentario}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: '11.5px', color: '#657193', fontStyle: 'italic' }}>
                        Aún no hay respuestas de los alumnos en este aviso.
                      </p>
                    )}
                  </div>

                  {/* Campo para responder como profesor al alumno */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={replyText[ann.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [ann.id]: e.target.value })}
                      placeholder="Responder al grupo..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: '12.5px',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleSendReply(ann.id)}
                      style={{
                        background: '#d92121',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '20px',
                        padding: '0 14px',
                        cursor: 'pointer'
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal donde capturo los datos para subir una nueva tarea */}
      {showTaskModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: '16px'
        }}>
          <div style={{
            background: '#151e36', width: '100%', maxWidth: '420px',
            borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Subir Nueva Tarea a Estudiantes
            </h3>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: '#9aa5c4', display: 'block', marginBottom: '4px' }}>Título de la tarea</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Práctica 5: Enrutamiento Dinámico"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '13px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#9aa5c4', display: 'block', marginBottom: '4px' }}>Fecha y hora de entrega</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Viernes, 23:59 h"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '13px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#9aa5c4', display: 'block', marginBottom: '4px' }}>Prioridad</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', background: '#0d1428',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '13px', outline: 'none'
                  }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#9aa5c4', display: 'block', marginBottom: '4px' }}>Instrucciones / Descripción</label>
                <textarea
                  rows="3"
                  placeholder="Instrucciones para los alumnos..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  style={{
                    flex: 1, padding: '12px', background: 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: '24px', color: '#fff', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Publicar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal donde redacto un comunicado para el muro de anuncios */}
      {showAnnModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: '16px'
        }}>
          <div style={{
            background: '#151e36', width: '100%', maxWidth: '420px',
            borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Publicar Anuncio al Grupo
            </h3>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: '#9aa5c4', display: 'block', marginBottom: '4px' }}>Título del aviso</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cambio de aula para examen"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '13px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#9aa5c4', display: 'block', marginBottom: '4px' }}>Mensaje para los alumnos</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Escribe el mensaje completo..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  style={{
                    flex: 1, padding: '12px', background: 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: '24px', color: '#fff', fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #2f80ed 0%, #1c5fc4 100%)' }}
                >
                  Publicar Anuncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
