import { useEffect } from 'react';
import { Bell, X, ChevronRight, ClipboardList, AlertCircle } from 'lucide-react';

export default function InAppNotificationBanner({ notification, onClose, onClick }) {
  // Configuro un temporizador para ocultar automáticamente el banner después de 6.5 segundos
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  // Verifico si el aviso recibido es una tarea o un comunicado general
  const isTask = notification.tipo === 'task';

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: '400px',
        zIndex: 9999,
        animation: 'slideDownNotification 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Contenedor principal con estilo cristalino blur tipo iOS/Android */}
      <div
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, rgba(21, 30, 54, 0.96) 0%, rgba(13, 19, 36, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(217, 33, 33, 0.55)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(217, 33, 33, 0.25)',
          borderRadius: '18px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}
      >
        {/* Icono temático con halo brillante distintivo de Universidad Alvart */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: isTask
              ? 'linear-gradient(135deg, #2f80ed 0%, #1e5cb3 100%)'
              : 'linear-gradient(135deg, #d92121 0%, #a81313 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
            boxShadow: isTask ? '0 4px 10px rgba(47, 128, 237, 0.4)' : '0 4px 10px rgba(217, 33, 33, 0.4)'
          }}
        >
          {isTask ? <ClipboardList size={20} /> : <Bell size={20} />}
        </div>

        {/* Textos informativos de la notificación */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: isTask ? '#64b5f6' : '#ff7a7a'
              }}
            >
              {isTask ? 'NUEVA TAREA ALVART' : 'AVISO ESCOLAR'}
            </span>
            <span style={{ fontSize: '10px', color: '#8b95b3' }}>• Ahora</span>
          </div>

          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {notification.titulo}
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#b0bbd8',
              lineHeight: 1.3,
              marginTop: '1px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {notification.descripcion}
          </div>
        </div>

        {/* Botón para descartar el banner manualmente */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#8b95b3',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <X size={14} />
        </button>
      </div>

      <style>{`
        @keyframes slideDownNotification {
          from {
            opacity: 0;
            transform: translate(-50%, -24px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
