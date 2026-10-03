import { Home, BookOpen, Calendar, User } from 'lucide-react';

export default function BottomNav({ currentScreen, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'grades', label: 'Materias', icon: BookOpen },
    { id: 'schedule', label: 'Calendario', icon: Calendar },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bottom-navbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            type="button"
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
