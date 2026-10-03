import { Mail, Phone, BookCheck, Award, Edit3, LogOut } from 'lucide-react';

export default function Profile({ user, onLogout }) {
  const profileDetails = [
    { label: 'Correo institucional', value: user?.correo || 'marlon@alvart.edu.mx', icon: Mail },
    { label: 'Teléfono', value: user?.telefono || '55 1234 5678', icon: Phone },
    { label: 'Plan de estudios', value: user?.carrera || 'Ingeniería en Sistemas', icon: BookCheck },
    { label: 'Semestre', value: user?.semestre || '6° Semestre', icon: Award },
  ];

  return (
    <div className="anim-fade padded-bottom">
      {/* Top Banner with White Lion Mascot & Red Dynamic Swoosh */}
      <div style={{
        height: '170px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #09122c 0%, #070b1a 100%)'
      }}>
        {/* Dynamic Red Energy Swooshes */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-40px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(217, 33, 33, 0.45) 0%, transparent 65%)',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #d92121 0%, rgba(47, 128, 237, 0.6) 100%)',
          zIndex: 4
        }}></div>

        {/* White Lion Mascot Graphic */}
        <div style={{
          position: 'absolute',
          right: '5px',
          top: '5px',
          width: '160px',
          height: '160px',
          backgroundImage: 'url(/assets/lion_alvart_v2.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat',
          opacity: 0.94,
          filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))',
          zIndex: 3
        }}></div>
      </div>

      {/* Avatar & Student Name */}
      <div style={{ textAlign: 'center', marginTop: '-52px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
        <div style={{
          width: '98px',
          height: '98px',
          borderRadius: '50%',
          margin: '0 auto 12px',
          border: '4px solid #070b1a',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          background: '#151e36'
        }}>
          <img src={user?.avatar || '/assets/profile.png'} alt="Estudiante" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
          {user?.nombre || 'Marlon Gómez Pastrana'}
        </h2>
        <p style={{ fontSize: '13px', color: '#9aa5c4' }}>
          Matrícula: <span style={{ color: '#fff', fontWeight: 500 }}>{user?.matricula || 'ALV2025001'}</span>
        </p>
        <p style={{ fontSize: '13px', color: '#8b95b3', marginTop: '2px' }}>
          {user?.carrera || 'Ingeniería en Sistemas'}
        </p>
      </div>

      {/* Info List */}
      <div style={{ padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
        {profileDetails.map((item, idx) => {
          const Icon = item.icon;
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
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#8b95b3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', color: '#8b95b3', display: 'block', marginBottom: '2px' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#f0f3fa' }}>
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}

        {/* Buttons */}
        <button
          className="btn-outline"
          style={{
            marginTop: '12px',
            borderColor: 'rgba(217, 33, 33, 0.6)',
            color: '#fff'
          }}
        >
          <Edit3 size={16} color="#d92121" />
          <span>Editar perfil</span>
        </button>

        <button
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#657193',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '14px',
            cursor: 'pointer',
            marginTop: '4px'
          }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
