import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';

export default function CalendarView({ onNavigate }) {
  const [selectedDay, setSelectedDay] = useState(14);

  // Calendar dates matrix for April 2025
  const calendarDays = [
    { day: 31, faint: true },
    { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
    { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, isBlue: true }, { day: 13 },
    { day: 14, isRed: true }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
    { day: 21 }, { day: 22 }, { day: 23, isRedDot: true }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 },
    { day: 28 }, { day: 29 }, { day: 30 }, { day: 1, faint: true }, { day: 2, faint: true }, { day: 3, faint: true }, { day: 4, faint: true }
  ];

  // Materias oficiales de Universidad Alvart con Laboratorio 3 / Aula 12
  const dayEvents = [
    {
      title: 'Bases de Datos en Web',
      time: '14:00 - 15:50',
      prof: 'Ivan Isai Guerrero R.',
      room: 'Laboratorio 3 / Aula 12',
      accent: '#2f80ed'
    },
    {
      title: 'Redes III',
      time: '17:00 - 19:50',
      prof: 'Mario Alberto Morales Z.',
      room: 'Laboratorio 3 / Aula 12',
      accent: '#2f80ed'
    },
    {
      title: 'Seminario de Tesis I (Revisión)',
      time: '16:00 - 16:50',
      prof: 'Jesus Santiago Angheven N.',
      room: 'Laboratorio 3 / Aula 12',
      accent: '#d92121'
    }
  ];

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
        <h2 style={{ fontSize: '17px', fontWeight: 600 }}>Calendario Escolar</h2>
        <div style={{ width: 24 }}></div>
      </div>

      {/* Month Navigator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        margin: '0 20px 16px',
        background: '#151e36',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <button style={{ background: 'transparent', border: 'none', color: '#9aa5c4', cursor: 'pointer' }}>
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: '16px', fontWeight: 700 }}>Abril 2025</span>
        <button style={{ background: 'transparent', border: 'none', color: '#9aa5c4', cursor: 'pointer' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{
        margin: '0 20px 20px',
        padding: '18px 12px',
        background: '#151e36',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {/* Days of week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '12px' }}>
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={i} style={{ fontSize: '11px', color: '#657193', fontWeight: 600 }}>
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '8px', textAlign: 'center' }}>
          {calendarDays.map((item, index) => {
            const isRedSelected = item.day === selectedDay && !item.faint;
            let bg = 'transparent';
            let color = item.faint ? '#3f4762' : '#cfd7eb';
            let boxShadow = 'none';

            if (item.isBlue && !item.faint) {
              bg = 'rgba(47, 128, 237, 0.2)';
              color = '#2f80ed';
            }

            if (isRedSelected || item.isRed) {
              bg = '#d92121';
              color = '#fff';
              boxShadow = '0 4px 12px rgba(217, 33, 33, 0.4)';
            }

            return (
              <div
                key={index}
                onClick={() => !item.faint && setSelectedDay(item.day)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12.5px',
                  fontWeight: isRedSelected || item.isBlue ? 700 : 400,
                  background: bg,
                  color: color,
                  boxShadow: boxShadow,
                  cursor: item.faint ? 'default' : 'pointer',
                  position: 'relative'
                }}
              >
                {item.day}
                {item.isRedDot && !isRedSelected && (
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#d92121'
                  }}></span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Materias y Horas Oficiales del Día */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Clases y Actividades del Día</h3>
          <span style={{ fontSize: '11px', color: '#8b95b3' }}>
            {selectedDay} de Abril
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dayEvents.map((evt, idx) => (
            <div
              key={idx}
              style={{
                background: '#151e36',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: `4px solid ${evt.accent}`,
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{evt.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9aa5c4' }}>
                  <Clock size={13} />
                  <span>{evt.time}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#8b95b3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={13} />
                  <span>{evt.prof}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={13} />
                  <span>{evt.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
