import { useState, useEffect } from 'react';
import { ChevronLeft, Bell, ClipboardList, AlertCircle, ChevronRight, CheckCircle2, Send } from 'lucide-react';
import notificationService from '../services/notificationService';

export default function Notifications({ user, onBack, onTriggerNativePush }) {
  // Manejo la lista de notificaciones históricas y el estado del permiso del sistema
  const [notifs, setNotifs] = useState([]);
  const [permissionStatus, setPermissionStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Consulto las notificaciones dirigidas al estudiante desde mi base de datos
  const fetchNotifs = async () => {
    try {
      const res = await fetch(`/api/notificaciones/${user?.id || 1}`);
      const data = await res.json();
      setNotifs(data);
    } catch (err) {
      console.error('Error al consultar mis notificaciones:', err);
    }
  };

  // Cargo el historial de notificaciones al iniciar y mantengo sincronización periódica
  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 6000);
    return () => clearInterval(interval);
  }, [user]);

  // Solicito permiso al usuario para enviar notificaciones push a su teléfono
  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        // Suscribo el teléfono a mi servidor con Web Push
        await notificationService.subscribeUserToPush(user?.id || 1);
        if (onTriggerNativePush) {
          onTriggerNativePush(
            '🔔 ¡Notificaciones Activadas!',
            'Recibirás avisos en tiempo real incluso con el teléfono apagado o bloqueado.'
          );
        }
      }
    } else {
      alert('Tu navegador no soporta la API de notificaciones.');
    }
  };

  // Función con la que disparo una prueba rápida de notificación push a mi teléfono
  const handleTestNotification = async () => {
    // Muestro la alerta visual de inmediato en pantalla
    if (onTriggerNativePush) {
      onTriggerNativePush(
        '📚 Tarea de Redes III',
        'Prof. Morales: Práctica 5: Subnetting y Topología publicada.'
      );
    }
    // Disparo la orden a mi servidor para que viaje por los servidores de Apple/Google
    try {
      await fetch('/api/push-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estudiante_id: user?.id || 1 })
      });
    } catch (e) {}
  };

  return (
    <div className="anim-fade padded-bottom">
      {/* Cabecera del Centro de Notificaciones */}
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
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 600 }}>Centro de Notificaciones</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div style={{ padding: '12px 20px' }}>
        {/* Tarjeta donde controlo el estado del permiso de notificaciones push */}
        <div style={{
          background: permissionStatus === 'granted' ? 'rgba(52, 199, 89, 0.12)' : 'rgba(217, 33, 33, 0.15)',
          border: permissionStatus === 'granted' ? '1px solid rgba(52, 199, 89, 0.4)' : '1px solid rgba(217, 33, 33, 0.4)',
          borderRadius: '18px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color={permissionStatus === 'granted' ? '#34c759' : '#d92121'} />
              <strong style={{ fontSize: '13.5px', color: '#fff' }}>
                {permissionStatus === 'granted' ? 'Notificaciones en Celular: Activadas' : 'Activar Notificaciones Push'}
              </strong>
            </div>
            {permissionStatus === 'granted' && (
              <span style={{ fontSize: '11px', color: '#34c759', fontWeight: 700 }}>Activo ✓</span>
            )}
          </div>

          <p style={{ fontSize: '12px', color: '#9aa5c4', lineHeight: 1.4, marginBottom: '14px' }}>
            {permissionStatus === 'granted'
              ? 'Tu teléfono recibirá alertas en la pantalla cuando los profesores publiquen tareas o anuncios.'
              : 'Permite las notificaciones para que tu celular te avise en tiempo real de nuevas tareas.'}
          </p>

          {permissionStatus !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="btn-primary"
              style={{ width: '100%', padding: '10px 14px', fontSize: '12.5px' }}
            >
              <Bell size={16} />
              <span>Permitir Notificaciones en este Teléfono</span>
            </button>
          ) : (
            <button
              onClick={handleTestNotification}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(52, 199, 89, 0.2)',
                border: '1px solid rgba(52, 199, 89, 0.5)',
                color: '#fff',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={15} color="#34c759" />
              <span>Enviar Notificación de Prueba a mi Celular</span>
            </button>
          )}
        </div>

        {/* Listado donde muestro el historial de avisos de la base de datos */}
        <h4 style={{ fontSize: '13px', color: '#8b95b3', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          Historial de Avisos ({notifs.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifs.map((n) => {
            const isTask = n.tipo === 'task';
            const iconBg = isTask ? 'rgba(47, 128, 237, 0.18)' : 'rgba(217, 33, 33, 0.18)';
            const iconColor = isTask ? '#2f80ed' : '#d92121';
            const Icon = isTask ? ClipboardList : AlertCircle;

            return (
              <div
                key={n.id}
                style={{
                  background: '#151e36',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: iconBg,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    {n.titulo}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#8b95b3', lineHeight: 1.4, marginBottom: '6px' }}>
                    {n.descripcion}
                  </p>
                  <span style={{ fontSize: '11px', color: '#657193' }}>
                    {n.fecha}
                  </span>
                </div>

                <ChevronRight size={16} color="#657193" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
