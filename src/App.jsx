import { useState, useEffect, useRef } from 'react';
import Splash from './views/Splash';
import Login from './views/Login';
import Home from './views/Home';
import Grades from './views/Grades';
import Schedule from './views/Schedule';
import CalendarView from './views/Calendar';
import Profile from './views/Profile';
import Notifications from './views/Notifications';
import Announcements from './views/Announcements';
import TeacherDashboard from './views/TeacherDashboard';
import BottomNav from './components/BottomNav';
import InstallModal from './components/InstallModal';
import InAppNotificationBanner from './components/InAppNotificationBanner';
import NotificationPermissionModal from './components/NotificationPermissionModal';
import notificationService from './services/notificationService';

export default function App() {
  // 1. Aquí recupero la sesión que guardé previamente en localStorage para que nunca se cierre sola
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alvart_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Si ya tenía la sesión abierta, elijo la pantalla que le corresponde según su rol
  const [currentScreen, setCurrentScreen] = useState(() => {
    try {
      const saved = localStorage.getItem('alvart_session_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.rol === 'docente' ? 'teacher-dashboard' : 'home';
      }
    } catch (e) {}
    return 'splash';
  });

  // Estados donde controlo la instalación de mi PWA en Android e iOS
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Estados donde manejo las alertas push y notificaciones en tiempo real
  const [activeBanner, setActiveBanner] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const lastKnownNotifIdRef = useRef(null);

  // Aquí detecto si mi aplicación ya fue instalada en el celular del usuario
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsInstalled(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Si el usuario completa la instalación, oculto el diálogo de instalación
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallModal(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  // Capturo el evento de instalación nativo para teléfonos Android
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Aquí gestiono la sincronización de tareas y avisos en tiempo real para el estudiante
  useEffect(() => {
    if (!currentUser || currentUser.rol !== 'estudiante') return;

    // Pregunto si el navegador permite pedir permisos de notificación
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPermissionModal(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }

    // Función donde consulto a mi servidor si hay nuevas tareas publicadas por los profesores
    const checkNewNotifications = async () => {
      try {
        const res = await fetch(`/api/notificaciones/${currentUser.id}`);
        if (!res.ok) return;
        const list = await res.json();

        if (Array.isArray(list)) {
          // En mi primera consulta, tomo nota del último ID registrado
          if (lastKnownNotifIdRef.current === null) {
            const maxId = list.length > 0 ? Math.max(...list.map(n => n.id)) : 0;
            lastKnownNotifIdRef.current = maxId;
            setUnreadNotifsCount(list.length);
            return;
          }

          // Detecto si llegaron avisos nuevos con ID superior al que ya conocía
          const newItems = list.filter(n => n.id > lastKnownNotifIdRef.current);
          if (newItems.length > 0) {
            const newest = newItems[0];
            const maxId = Math.max(...list.map(n => n.id));
            lastKnownNotifIdRef.current = maxId;

            // Disparo la notificación nativa del teléfono con sonido y vibración
            notificationService.showNativeNotification(newest.titulo, {
              body: newest.descripcion,
              tag: `notif-${newest.id}`,
              data: newest
            });

            // Muestro mi banner flotante interactivo en la parte superior de la pantalla
            setActiveBanner(newest);

            // Incremento el contador de notificaciones no leídas
            setUnreadNotifsCount(prev => prev + newItems.length);
          }
        }
      } catch (err) {
        console.error('Tuve un problema al sincronizar las notificaciones:', err);
      }
    };

    // Hago mi primera revisión de inmediato y sigo consultando cada 4 segundos
    checkNewNotifications();
    const interval = setInterval(checkNewNotifications, 4000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Manejo la navegación entre pantallas de mi aplicación
  const handleNavigate = (screen) => {
    if (screen === 'notifications') {
      // Si el alumno entra a ver sus notificaciones, limpio el contador de no leídas
      setUnreadNotifsCount(0);
    }
    setCurrentScreen(screen);
  };

  // Proceso el inicio de sesión exitoso y guardo los datos en localStorage
  const handleLoginSuccess = (user) => {
    try {
      localStorage.setItem('alvart_session_user', JSON.stringify(user));
    } catch (e) {}
    setCurrentUser(user);
    if (user.rol === 'docente') {
      setCurrentScreen('teacher-dashboard');
    } else {
      setCurrentScreen('home');
      // Aseguro la suscripción Web Push en caso de que ya tenga permisos concedidos
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        notificationService.subscribeUserToPush(user.id || 1);
      }
    }
  };

  // Cierro la sesión y limpio mi almacenamiento local para volver al login
  const handleLogout = () => {
    try {
      localStorage.removeItem('alvart_session_user');
    } catch (e) {}
    setCurrentUser(null);
    lastKnownNotifIdRef.current = null;
    setActiveBanner(null);
    setCurrentScreen('login');
  };

  // Función auxiliar para emitir notificaciones de prueba manuales
  const handleTriggerNativePush = (title, body) => {
    notificationService.showNativeNotification(title, { body });
    setActiveBanner({
      id: Date.now(),
      titulo: title,
      descripcion: body,
      tipo: 'task'
    });
  };

  // Solo muestro la barra inferior de navegación si el usuario es alumno
  const showBottomNav = currentUser?.rol !== 'docente' && ['home', 'grades', 'schedule', 'calendar', 'profile'].includes(currentScreen);

  return (
    <div className="mobile-frame">
      {/* Muestro mi banner flotante de notificación push cuando llega un aviso */}
      {activeBanner && (
        <InAppNotificationBanner
          notification={activeBanner}
          onClose={() => setActiveBanner(null)}
          onClick={() => {
            setActiveBanner(null);
            handleNavigate(activeBanner.tipo === 'alert' ? 'announcements' : 'notifications');
          }}
        />
      )}

      {/* Muestro mi ventana modal donde le solicito al alumno permiso para notificarlo */}
      <NotificationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onPermissionGranted={() => setShowPermissionModal(false)}
      />

      {/* Aquí renderizo la pantalla que corresponda según el estado currentScreen */}
      <div className="app-screen-content">
        {currentScreen === 'splash' && (
          <Splash onFinish={() => setCurrentScreen('login')} />
        )}

        {currentScreen === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Vista exclusiva para el profesor Mario Morales (redes01) */}
        {currentScreen === 'teacher-dashboard' && currentUser?.rol === 'docente' && (
          <TeacherDashboard user={currentUser} onLogout={handleLogout} />
        )}

        {/* Vistas principales para el estudiante Marlon Gómez (sc0710) */}
        {currentScreen === 'home' && (
          <Home
            user={currentUser}
            onNavigate={handleNavigate}
            onOpenNotifications={() => handleNavigate('notifications')}
            onPromptInstall={() => setShowInstallModal(true)}
            isPwaInstallable={!isInstalled}
            onLogout={handleLogout}
            unreadCount={unreadNotifsCount}
          />
        )}

        {currentScreen === 'grades' && (
          <Grades user={currentUser} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'schedule' && (
          <Schedule user={currentUser} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'calendar' && (
          <CalendarView user={currentUser} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'announcements' && (
          <Announcements user={currentUser} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'profile' && (
          <Profile user={currentUser} onLogout={handleLogout} />
        )}

        {currentScreen === 'notifications' && (
          <Notifications
            user={currentUser}
            onBack={() => handleNavigate('home')}
            onTriggerNativePush={handleTriggerNativePush}
          />
        )}
      </div>

      {/* Barra de navegación inferior con pestañas para el estudiante */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      )}

      {/* Modal donde guío al usuario para instalar la PWA en su dispositivo */}
      {showInstallModal && !isInstalled && (
        <InstallModal
          deferredPrompt={deferredPrompt}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </div>
  );
}
