import { useState, useEffect } from 'react';
import { Menu, Bell, GraduationCap, ChevronRight, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import AlvartLogo from '../components/AlvartLogo';
import SidebarDrawer from '../components/SidebarDrawer';

export default function Home({ user, onNavigate, onOpenNotifications, onPromptInstall, isPwaInstallable, onLogout, unreadCount = 0 }) {
  // Manejo el estado de apertura del menú lateral y la lista de tareas del alumno
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Consulto las tareas reales guardadas en mi base de datos SQLite
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tareas');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error al cargar mis tareas:', err);
    }
  };

  // Cargo las tareas al montar el componente y las actualizo periódicamente
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 7000);
    return () => clearInterval(interval);
  }, []);

  // Al tocar una tarea, la marco como leída en la base de datos para que el profesor lo vea
  const handleTaskClick = async (task) => {
    try {
      await fetch(`/api/tareas/${task.id}/marcar-visto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudiante_id: user?.id || 1,
          estudiante_nombre: user?.nombre || 'Marlon Gómez Pastrana'
        })
      });
      // Vuelvo a consultar para reflejar la marca de visto de inmediato
      fetchTasks();
    } catch (err) {
      console.error('No pude marcar la tarea como vista:', err);
    }
  };

  // Obtengo el primer nombre del alumno para mostrar un saludo amigable
  const firstName = user?.nombre ? user.nombre.split(' ')[0] : 'Marlon';

  return (
    <div className="anim-fade padded-bottom">
      {/* Menú lateral tipo Drawer accesible desde las 3 rayas */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Barra superior de navegación */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        background: 'rgba(7, 11, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 40
      }}>
        {/* Botón de las 3 rayas con el que abro mi menú lateral */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
        >
          <Menu size={24} />
        </button>

        {/* Logotipo oficial de Universidad Alvart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <AlvartLogo size={28} />
          <span style={{ fontSize: '13px', letterSpacing: '1px' }}>
            UNIVERSIDAD <b style={{ fontWeight: 800 }}>ALVART</b>
          </span>
        </div>

        {/* Campana de avisos con indicador de no leídos y avatar de usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenNotifications}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <Bell size={21} />
            {unreadCount > 0 ? (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-7px',
                minWidth: '16px',
                height: '16px',
                background: '#d92121',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 8px rgba(217, 33, 33, 0.7)'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '7px',
                height: '7px',
                background: '#34c759',
                borderRadius: '50%'
              }}></span>
            )}
          </button>

          <div
            onClick={() => onNavigate('profile')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.8)',
              cursor: 'pointer'
            }}
          >
            <img src={user?.avatar || '/assets/profile.png'} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* Banner de instalación PWA (solo lo muestro si aún no está instalada) */}
      {isPwaInstallable && (
        <div className="pwa-banner">
          <div>
            <strong style={{ display: 'block', color: '#fff' }}>¿Instalar app en tu celular?</strong>
            <span>Acceso rápido sin abrir el navegador</span>
          </div>
          <button className="pwa-banner-btn" onClick={onPromptInstall}>
            Instalar
          </button>
        </div>
      )}

      {/* Saludo personalizado al estudiante */}
      <div style={{ padding: '12px 20px 18px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Hola, {firstName} 👋</h2>
        <p style={{ color: '#9aa5c4', fontSize: '13px', marginTop: '4px' }}>¡Qué bueno verte de nuevo!</p>
      </div>

      {/* Tarjeta institucional con la fotografía real del campus de Universidad Alvart */}
      <div style={{
        margin: '0 20px 18px',
        height: '175px',
        borderRadius: '22px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Imagen de fondo real del campus */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(/assets/campus_real.jpg?v=2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.65)'
        }}></div>

        {/* Gradiente oscuro para asegurar contraste y legibilidad del lema */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(7, 11, 26, 0.88) 0%, rgba(7, 11, 26, 0.4) 60%, rgba(7, 11, 26, 0.2) 100%)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '85%' }}>
          <p style={{
            fontSize: '14px',
            fontStyle: 'italic',
            lineHeight: 1.45,
            color: '#ffffff',
            textShadow: '0 2px 6px rgba(0,0,0,0.85)'
          }}>
            “La disciplina hoy, construye el éxito de mañana.”
          </p>
        </div>
      </div>

      {/* Acceso directo al Muro de Anuncios Institucional */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <div
          onClick={() => onNavigate('announcements')}
          style={{
            background: 'linear-gradient(135deg, rgba(47, 128, 237, 0.15) 0%, rgba(13, 20, 40, 0.6) 100%)',
            border: '1px solid rgba(47, 128, 237, 0.35)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#2f80ed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>Muro de Anuncios</strong>
              <span style={{ fontSize: '11px', color: '#9aa5c4' }}>Avisos de tus profesores y respuestas del grupo</span>
            </div>
          </div>
          <ChevronRight size={18} color="#2f80ed" />
        </div>
      </div>

      {/* Sección de próximos eventos del calendario */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Próximos eventos</h3>
          <span
            onClick={() => onNavigate('calendar')}
            style={{ fontSize: '12px', color: '#d92121', fontWeight: 500, cursor: 'pointer' }}
          >
            Ver todos
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            onClick={() => onNavigate('calendar')}
            style={{
              background: '#151e36',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(47, 128, 237, 0.18)',
              color: '#2f80ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <GraduationCap size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>
                Examen Parcial de Bases de Datos en Web
              </h4>
              <p style={{ fontSize: '12px', color: '#8b95b3' }}>
                14:00 - 15:50 | Prof. Ivan Isai Guerrero R. | Laboratorio 3 / Aula 12
              </p>
            </div>
            <ChevronRight size={18} color="#657193" />
          </div>

          <div
            onClick={() => onNavigate('schedule')}
            style={{
              background: '#151e36',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(217, 33, 33, 0.18)',
              color: '#d92121',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>
                Entrega de Avance de Seminario de Tesis I
              </h4>
              <p style={{ fontSize: '12px', color: '#8b95b3' }}>
                16:00 - 16:50 | Prof. Jesus Santiago Angheven N. | Aula 12
              </p>
            </div>
            <ChevronRight size={18} color="#657193" />
          </div>
        </div>
      </div>

      {/* Sección de Pendientes conectados a la base de datos (con confirmación de visto) */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pendientes</h3>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: 'rgba(217, 33, 33, 0.2)',
              color: '#ff6b6b',
              fontWeight: 700
            }}>
              {tasks.length} asignadas
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#8b95b3' }}>Toca para ver</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task) => {
            const hasViewed = task.vistas && task.vistas.some(v => v.estudiante_nombre?.includes(firstName));

            return (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                style={{
                  background: '#151e36',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  border: hasViewed ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                  background: hasViewed ? '#34c759' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {hasViewed && <CheckCircle2 size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    marginBottom: '3px',
                    color: '#fff'
                  }}>
                    {task.title || task.titulo}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#8b95b3' }}>
                    <span style={{ color: '#2f80ed', fontWeight: 500 }}>{task.materia}</span>
                    <span>•</span>
                    <span style={{ color: task.prioridad === 'Urgente' ? '#ff6b6b' : '#8b95b3' }}>
                      {task.fecha_entrega}
                    </span>
                  </div>
                  {task.descripcion && (
                    <p style={{ fontSize: '11.5px', color: '#9aa5c4', marginTop: '4px', fontStyle: 'italic' }}>
                      {task.descripcion}
                    </p>
                  )}
                </div>

                {hasViewed ? (
                  <span style={{ fontSize: '10.5px', color: '#34c759', fontWeight: 600 }}>
                    Visto ✓
                  </span>
                ) : (
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '10px',
                    background: 'rgba(217, 33, 33, 0.2)',
                    color: '#ff6b6b',
                    fontSize: '10.5px',
                    fontWeight: 700
                  }}>
                    Nueva
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
