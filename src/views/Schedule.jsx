import { useState } from 'react';
import { ChevronLeft, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export default function Schedule({ onNavigate }) {
  const [viewMode, setViewMode] = useState('Semana');
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Default Miércoles

  const days = [
    { day: 'Lun', date: 12, name: 'Lunes' },
    { day: 'Mar', date: 13, name: 'Martes' },
    { day: 'Mié', date: 14, name: 'Miércoles' },
    { day: 'Jue', date: 15, name: 'Jueves' },
    { day: 'Vie', date: 16, name: 'Viernes' },
  ];

  // Horario Real Oficial de Universidad Alvart (Escolarizada Licenciatura 7-A | Ing. en Sistemas)
  const scheduleData = {
    0: [ // Lunes
      { title: 'Arquitectura de Computadoras', time: '14:00 - 16:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Emmanuel Carrasco C.', accent: '#9b51e0' },
      { title: 'Redes III', time: '17:00 - 17:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Mario Alberto Morales Z.', accent: '#2f80ed' },
      { title: 'Taller de AutoCAD', time: '18:00 - 19:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Marco Antonio Contreras B.', accent: '#f2994a' },
    ],
    1: [ // Martes
      { title: 'Compiladores', time: '14:00 - 16:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Emmanuel Carrasco C.', accent: '#34c759' },
      { title: 'Ética Profesional', time: '18:00 - 19:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Orlando Martinez G.', accent: '#bb6bd9' },
    ],
    2: [ // Miércoles
      { title: 'Bases de Datos en Web', time: '14:00 - 15:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Ivan Isai Guerrero R.', accent: '#2f80ed' },
      { title: 'Redes III', time: '17:00 - 19:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Mario Alberto Morales Z.', accent: '#2f80ed' },
    ],
    3: [ // Jueves
      { title: 'Seminario de Tesis I', time: '14:00 - 16:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Jesus Santiago Angheven N.', accent: '#d92121' },
    ],
    4: [ // Viernes
      { title: 'Bases de Datos en Web', time: '14:00 - 15:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Ivan Isai Guerrero R.', accent: '#2f80ed' },
      { title: 'Compiladores', time: '16:00 - 16:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Emmanuel Carrasco C.', accent: '#34c759' },
      { title: 'Derecho Informático', time: '17:00 - 19:50', room: 'Laboratorio 3 / Aula 12', teacher: 'Victor Hugo Marcos D.', accent: '#f2c94c' },
    ],
  };

  const currentClasses = scheduleData[selectedDayIndex] || [];

  return (
    <div className="anim-fade padded-bottom">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        background: 'rgba(7, 11, 26, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 40
      }}>
        <button
          onClick={() => onNavigate('home')}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 600 }}>Horario de Clases</h2>
          <span style={{ fontSize: '11px', color: '#8b95b3' }}>7° Semestre - A | Ing. en Sistemas</span>
        </div>
        <div style={{ width: 24 }}></div>
      </div>

      {/* Semana / Mes Switch */}
      <div style={{
        margin: '10px 20px 20px',
        padding: '4px',
        background: '#151e36',
        borderRadius: '30px',
        display: 'flex'
      }}>
        {['Semana', 'Mes'].map((mode) => (
          <button
            key={mode}
            onClick={() => {
              if (mode === 'Mes') {
                onNavigate('calendar');
              } else {
                setViewMode(mode);
              }
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '26px',
              border: 'none',
              background: viewMode === mode ? '#d92121' : 'transparent',
              color: viewMode === mode ? '#fff' : '#8b95b3',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Date Carousel (Lun - Vie) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 20px',
        marginBottom: '20px'
      }}>
        {days.map((d, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <div
              key={d.date}
              onClick={() => setSelectedDayIndex(index)}
              style={{
                width: '58px',
                padding: '12px 6px',
                borderRadius: '18px',
                background: isSelected ? '#d92121' : '#151e36',
                border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 8px 20px rgba(217, 33, 33, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.9)' : '#8b95b3' }}>
                {d.day}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                {d.date}
              </span>
            </div>
          );
        })}
      </div>

      {/* Classes list for selected day */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ fontSize: '13px', color: '#9aa5c4', fontWeight: 600 }}>
            {days[selectedDayIndex].name} ({currentClasses.length} materias)
          </span>
          <span style={{ fontSize: '11px', color: '#657193' }}>Turno Vespertino</span>
        </div>

        {currentClasses.map((cls, idx) => (
          <div
            key={idx}
            style={{
              background: '#151e36',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderLeft: `4px solid ${cls.accent}`,
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '14.5px', fontWeight: 600 }}>{cls.title}</h4>
              <ChevronRight size={16} color="#657193" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9aa5c4', fontSize: '12.5px', marginBottom: '12px' }}>
              <Clock size={14} color="#9aa5c4" />
              <span>{cls.time}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b95b3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} />
                <span>{cls.room}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={13} />
                <span>{cls.teacher}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
