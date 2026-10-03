import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export default function InstallModal({ deferredPrompt, onClose }) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
  }, []);

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User response to install:', outcome);
      onClose();
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
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
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
          <img src="/assets/logo.png" alt="Logo" style={{ width: 44, height: 44, borderRadius: '12px' }} />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Instalar ControlEDU</h3>
            <p style={{ fontSize: '13px', color: '#9aa5c4' }}>Universidad Alvart</p>
          </div>
        </div>

        {isIOS ? (
          <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#cfd7eb' }}>
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
          <div>
            <p style={{ fontSize: '14px', color: '#cfd7eb', marginBottom: '18px' }}>
              Instala esta aplicación en tu teléfono Android para acceder a tus calificaciones y horarios sin conexión.
            </p>
            <button
              onClick={handleInstallAndroid}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <Download size={18} />
              Instalar en este dispositivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
