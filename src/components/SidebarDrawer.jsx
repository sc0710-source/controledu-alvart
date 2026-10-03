import { X, BookOpen, Calendar, CheckCircle2, FileText, Star, CreditCard, LogOut, ChevronRight, MessageSquare } from 'lucide-react';
import AlvartLogo from './AlvartLogo';

export default function SidebarDrawer({ isOpen, onClose, user, onNavigate, onLogout }) {
  if (!isOpen) return null;

  // Defino las opciones que pongo a disposición en mi menú lateral
  const menuItems = [
    { id: 'grades', label: 'Mis materias', icon: BookOpen, count: '8' },
    { id: 'schedule', label: 'Horarios', icon: Calendar },
    { id: 'announcements', label: 'Muro de Anuncios', icon: MessageSquare, badge: 'Activo' },
    { id: 'attendance', label: 'Asistencias', icon: CheckCircle2, badge: '96%' },
    { id: 'tasks', label: 'Tareas y Entregas', icon: FileText, badge: 'Pendientes' },
    { id: 'grades', label: 'Calificaciones', icon: Star, badge: '8.9' },
    { id: 'calendar', label: 'Calendario escolar', icon: Calendar },
    { id: 'payments', label: 'Pagos y Trámites', icon: CreditCard },
  ];

  // Manejo la selección de una opción del menú y redirijo a la pantalla indicada
  const handleItemClick = (id) => {
    onClose();
    if (id === 'grades' || id === 'schedule' || id === 'calendar' || id === 'announcements') {
      onNavigate(id);
    } else if (id === 'attendance') {
      alert('Asistencia general: 96% de asistencia registrada en el ciclo escolar.');
    } else if (id === 'tasks') {
      onNavigate('home');
    } else if (id === 'payments') {
      alert('Finanzas: Colegiatura al corriente. Próximo corte: 15 de Octubre.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
      display: 'flex'
    }}>
      {/* Fondo oscuro traslúcido para cerrar el menú al tocar afuera */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Panel lateral deslizable */}
      <div style={{
        position: 'relative',
        width: '82%',
        maxWidth: '320px',
        height: '100%',
        background: '#0d1428',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 1000,
        boxShadow: '8px 0 30px rgba(0, 0, 0, 0.7)',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Cabecera del menú lateral con logotipo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlvartLogo size={28} />
              <span style={{ fontSize: '13px', letterSpacing: '1px' }}>
                UNIVERSIDAD <b style={{ fontWeight: 800 }}>ALVART</b>
              </span>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#9aa5c4', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Tarjeta de perfil del estudiante activo */}
          <div
            onClick={() => { onClose(); onNavigate('profile'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(217, 33, 33, 0.8)'
            }}>
              <img src={user?.avatar || '/assets/profile.png'} alt="Marlon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.nombre || 'Marlon Gómez Pastrana'}
              </h4>
              <p style={{ fontSize: '11px', color: '#8b95b3' }}>
                {user?.usuario || 'sc0710'}
              </p>
            </div>
            <ChevronRight size={16} color="#657193" />
          </div>
        </div>

        {/* Lista de navegación con iconos institucionales */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <span style={{ fontSize: '11px', color: '#657193', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '12px', marginBottom: '8px', display: 'block' }}>
            Navegación Institucional
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: '#dbe2f5',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={19} color="#9aa5c4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(217, 33, 33, 0.18)',
                      color: '#d92121',
                      fontWeight: 600
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón inferior para cerrar sesión */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={() => { onClose(); onLogout(); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              color: '#ff6b6b',
              fontSize: '13.5px',
              fontWeight: 500,
              padding: '8px 0',
              cursor: 'pointer'
            }}
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
