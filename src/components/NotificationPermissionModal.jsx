import { Bell, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import notificationService from '../services/notificationService';

export default function NotificationPermissionModal({ isOpen, onClose, onPermissionGranted }) {
  if (!isOpen) return null;

  // Manejo la autorización del usuario cuando pulsa el botón de permitir notificaciones
  const handleAllow = async () => {
    // Solicito el permiso nativo al navegador
    const perm = await notificationService.requestPermission();
    if (perm === 'granted') {
      // Suscribo el teléfono a los servicios de Apple/Google mediante Web Push
      await notificationService.subscribeUserToPush(1);
      // Muestro la primera notificación de bienvenida
      notificationService.showNativeNotification('🔔 ¡Notificaciones Activadas!', {
        body: 'Hola Marlon, ahora recibirás avisos en tu celular incluso con la pantalla apagada.'
      });
      onPermissionGranted();
    } else {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 20, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 16px 0',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      {/* Contenedor tipo Bottom Sheet que se desliza desde abajo hacia arriba */}
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'linear-gradient(180deg, #172342 0%, #0d1527 100%)',
          border: '1.5px solid rgba(217, 33, 33, 0.45)',
          borderRadius: '26px 26px 20px 20px',
          padding: '24px 22px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #d92121 0%, #8e1010 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 6px 18px rgba(217, 33, 33, 0.4)'
            }}
          >
            <Bell size={24} />
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#8b95b3',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          ¿Activar notificaciones en tu celular?
        </h3>

        <p style={{ fontSize: '13px', color: '#9aa5c4', lineHeight: 1.45, marginBottom: '18px' }}>
          Para que la app te avise en tiempo real cuando tus profesores de <b style={{ color: '#fff' }}>Redes III</b> y otras materias publiquen tareas, fechas límite o comunicados urgentes.
        </p>

        {/* Lista de beneficios explicados para generar confianza en el alumno */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#b6c2e2' }}>
            <CheckCircle2 size={16} color="#34c759" />
            <span>Alertas automáticas de nuevas tareas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#b6c2e2' }}>
            <CheckCircle2 size={16} color="#34c759" />
            <span>Avisos de maestros y cambios de aula</span>
          </div>
        </div>

        {/* Botones de acción del diálogo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleAllow}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px 18px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Bell size={18} />
            <span>Permitir Notificaciones</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '11px 18px',
              background: 'transparent',
              border: 'none',
              color: '#8b95b3',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}
