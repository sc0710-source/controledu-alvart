import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, MoreVertical, CheckCircle2 } from 'lucide-react';

export default function InstallModal({ deferredPrompt, onClose }) {
  const [isIOS, setIsIOS] = useState(false);
  const [showAndroidManualHelp, setShowAndroidManualHelp] = useState(false);

  // Detecto si el dispositivo móvil es iOS (iPhone / iPad) o Android
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
  }, []);

  // Manejo la instalación nativa en dispositivos Android
  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Respuesta del usuario al diálogo de instalación:', outcome);
      onClose();
    } else {
      // Si el navegador aún no preparó el evento automático, le muestro los pasos manuales de Chrome
      setShowAndroidManualHelp(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 999,
      padding: '0 16px 24px 16px'
    }}>
      <div style={{
        background: '#151e36',
        border: '1.5px solid rgba(217, 33, 33, 0.45)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '410px',
        padding: '24px',
        color: '#fff',
        position: 'relative',
        animation: 'fadeIn 0.25s ease'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#8b95b3',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <img src="/assets/icon_192.png" alt="Logo" style={{ width: 44, height: 44, borderRadius: '12px' }} />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Instalar ControlEDU</h3>
            <p style={{ fontSize: '13px', color: '#9aa5c4' }}>Universidad Alvart</p>
          </div>
        </div>

        {isIOS ? (
          // Instrucciones específicas para iPhone (Safari)
          <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#cfd7eb' }}>
            <p style={{ marginBottom: '12px' }}>
              Para instalar en tu <strong>iPhone</strong>:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px', borderRadius: '8px' }}>
                <Share size={18} color="#2f80ed" />
              </span>
              <span>1. Toca el botón <strong>Compartir</strong> en Safari.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px', borderRadius: '8px' }}>
                <PlusSquare size={18} color="#34c759" />
              </span>
              <span>2. Selecciona <strong>Agregar a pantalla de inicio</strong>.</span>
            </div>
          </div>
        ) : (
          // Instrucciones y botón para Android (Google Chrome)
          <div>
            <p style={{ fontSize: '13px', color: '#cfd7eb', marginBottom: '16px', lineHeight: 1.45 }}>
              Instala la app en tu teléfono Android para recibir notificaciones de tareas y consultar tus materias sin abrir el navegador.
            </p>

            <button
              onClick={handleInstallAndroid}
              className="btn-primary"
              style={{ width: '100%', marginBottom: '14px', padding: '13px 18px', fontSize: '14px' }}
            >
              <Download size={18} />
              <span>Instalar en este dispositivo</span>
            </button>

            {/* Guía alternativa si el navegador requiere instalación desde el menú de 3 puntos */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '12px 14px',
              fontSize: '12.5px',
              color: '#9aa5c4',
              lineHeight: 1.45
            }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>
                O instálala directamente desde Chrome:
              </strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <MoreVertical size={16} color="#2f80ed" />
                <span>1. Toca los <strong>tres puntos (⋮)</strong> arriba a la derecha en Chrome.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34c759" />
                <span>2. Pulsa <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
