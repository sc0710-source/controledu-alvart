import { useState } from 'react';
import { ChevronLeft, Cpu, Terminal, Database, Network, GraduationCap, PenTool, Scale, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Grades({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('Materias');

  // Materias oficiales de la carrera (7-A | Ingeniería en Sistemas)
  const subjects = [
    { name: 'Arquitectura de Computadoras', term: '7° Semestre', grade: '9.5', icon: Cpu, color: '#9b51e0', bg: 'rgba(155, 81, 224, 0.15)' },
    { name: 'Compiladores', term: '7° Semestre', grade: '8.7', icon: Terminal, color: '#34c759', bg: 'rgba(52, 199, 89, 0.15)' },
    { name: 'Bases de Datos en Web', term: '7° Semestre', grade: '9.0', icon: Database, color: '#2f80ed', bg: 'rgba(47, 128, 237, 0.15)' },
    { name: 'Redes III', term: '7° Semestre', grade: '8.5', icon: Network, color: '#2d9cdb', bg: 'rgba(45, 156, 219, 0.15)' },
    { name: 'Seminario de Tesis I', term: '7° Semestre', grade: '9.2', icon: GraduationCap, color: '#d92121', bg: 'rgba(217, 33, 33, 0.15)' },
    { name: 'Taller de AutoCAD', term: '7° Semestre', grade: '9.0', icon: PenTool, color: '#f2994a', bg: 'rgba(242, 153, 74, 0.15)' },
    { name: 'Ética Profesional', term: '7° Semestre', grade: '9.4', icon: ShieldCheck, color: '#bb6bd9', bg: 'rgba(187, 107, 217, 0.15)' },
    { name: 'Derecho Informático', term: '7° Semestre', grade: '8.8', icon: Scale, color: '#f2c94c', bg: 'rgba(242, 201, 76, 0.15)' }
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
        <h2 style={{ fontSize: '17px', fontWeight: 600 }}>Calificaciones</h2>
        <div style={{ width: 24 }}></div>
      </div>

      {/* Promedio General Card */}
      <div style={{
        margin: '10px 20px 20px',
        padding: '22px',
        background: '#151e36',
        borderRadius: '22px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '13px', color: '#8b95b3' }}>Promedio general</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0 8px' }}>
            <span style={{ fontSize: '38px', fontWeight: 800 }}>8.9</span>
            <span style={{ fontSize: '18px', color: '#8b95b3' }}>/ 10</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34c759' }}>
            <TrendingUp size={14} />
            <span>+0.3 vs. periodo anterior</span>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div style={{ position: 'relative', width: '74px', height: '74px' }}>
          <svg width="74" height="74" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="37" cy="37" r="30" stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="transparent" />
            <circle
              cx="37"
              cy="37"
              r="30"
              stroke="#2f80ed"
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 30}
              strokeDashoffset={2 * Math.PI * 30 * (1 - 0.89)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2f80ed'
          }}>
            <Database size={20} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '0 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '16px'
      }}>
        {['Materias', 'Historial'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#fff' : '#657193',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {tab}
            {activeTab === tab && (
              <div style={{
                position: 'absolute',
                bottom: '-1px',
                left: 0,
                right: 0,
                height: '2.5px',
                background: '#d92121',
                borderRadius: '3px 3px 0 0'
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Subject List */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {subjects.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#151e36',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: sub.bg,
                color: sub.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sub.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#8b95b3' }}>{sub.term}</p>
              </div>

              <span style={{ fontSize: '16px', fontWeight: 700, marginRight: '6px' }}>
                {sub.grade}
              </span>

              <span style={{
                padding: '4px 10px',
                background: 'rgba(52, 199, 89, 0.16)',
                color: '#34c759',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                flexShrink: 0
              }}>
                Aprobada
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
