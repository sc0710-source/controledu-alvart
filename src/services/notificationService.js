// Aquí implemento mi servicio de sonido, vibración y notificaciones Web Push VAPID

// Convierto la clave pública en formato base64 a un arreglo de bytes que necesita el PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

class NotificationService {
  constructor() {
    // Mantengo mi contexto de audio para sintetizar sonidos en el navegador
    this.audioCtx = null;
  }

  // Reproduzco un tono de campana agradable usando Web Audio API sin requerir archivos mp3
  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!this.audioCtx || this.audioCtx.state === 'suspended') {
        this.audioCtx = new AudioContext();
      }

      const now = this.audioCtx.currentTime;

      // Genero mi primer tono suave (frecuencia Re 5 a 587.33 Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Genero mi segundo tono brillante (frecuencia La 5 a 880 Hz)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.28, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('El audio chime no está soportado en este navegador:', e);
    }
  }

  // Hago vibrar el dispositivo móvil si cuenta con soporte de hardware
  vibrate(pattern = [200, 100, 200]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Ignoro si el dispositivo no soporta la API de vibración
    }
  }

  // Solicito explícitamente el permiso de notificaciones al usuario
  async requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.error('Ocurrió un error al solicitar el permiso de notificación:', err);
      return 'denied';
    }
  }

  // Suscribo el celular al protocolo oficial Web Push (Apple APNs / Google FCM)
  // Con esto logro que los avisos lleguen incluso con la pantalla bloqueada o la app cerrada
  async subscribeUserToPush(estudianteId = 1) {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('El navegador no soporta PushManager para notificaciones en segundo plano');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Obtengo la clave pública VAPID desde mi servidor
      const resKey = await fetch('/api/vapid-public-key');
      const { publicKey } = await resKey.json();

      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      // Verifico si el dispositivo ya tiene suscripción o genero una nueva con el fabricante
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });
      }

      // Envío los datos de suscripción a mi servidor para guardarlos en SQLite
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudiante_id: estudianteId,
          subscription: subscription.toJSON()
        })
      });

      console.log('Mi teléfono se suscribió con éxito al servicio Web Push en segundo plano');
      return true;
    } catch (err) {
      console.error('Error al suscribir el dispositivo a Web Push:', err);
      return false;
    }
  }

  // Disparo una notificación nativa del sistema en la pantalla de bloqueo o bandeja del celular
  async showNativeNotification(title, options = {}) {
    this.playChime();
    this.vibrate();

    const notifOptions = {
      body: options.body || '',
      icon: options.icon || '/assets/app_icon.png',
      badge: options.badge || '/assets/app_icon.png',
      tag: options.tag || 'alvart-notif-' + Date.now(),
      vibrate: [200, 100, 200],
      data: options.data || {},
      requireInteraction: false
    };

    // Intento mostrar la notificación a través de mi Service Worker (estándar PWA)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, notifOptions);
          return true;
        }
      } catch (swErr) {
        console.warn('Mi Service Worker no pudo mostrar la notificación:', swErr);
      }
    }

    // Si el Service Worker no responde, uso el fallback directo de Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, notifOptions);
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        return true;
      } catch (notifErr) {
        console.warn('Falló el método alternativo de notificación:', notifErr);
      }
    }

    return false;
  }
}

// Exporto mi instancia única del servicio de notificaciones
export const notificationService = new NotificationService();
export default notificationService;
