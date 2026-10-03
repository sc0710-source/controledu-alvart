import { useEffect } from 'react';
import AlvartLogo from '../components/AlvartLogo';

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="anim-fade"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 24px',
        background: `radial-gradient(circle at 50% 20%, #16203c 0%, #070b1a 80%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top University Branding */}
      <div style={{ textAlign: 'center', marginTop: '10vh', zIndex: 5 }}>
        <AlvartLogo size={90} />

        <h1 style={{
          fontSize: '20px',
          fontWeight: 400,
          letterSpacing: '3px',
          lineHeight: '1.2',
          marginTop: '16px'
        }}>
          UNIVERSIDAD<br />
          <span style={{ fontWeight: 800, fontSize: '30px', letterSpacing: '4px' }}>ALVART</span>
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#8b95b3',
          marginTop: '8px',
          letterSpacing: '1px'
        }}>
          Formación que trasciende
        </p>
      </div>

      {/* White Lion Athletic Mascot with Slogan */}
      <div style={{
        position: 'relative',
        height: '300px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '20px',
        zIndex: 2
      }}>
        {/* White Lion Mascot Image */}
        <div style={{
          position: 'absolute',
          right: '-15px',
          bottom: '10px',
          width: '240px',
          height: '270px',
          backgroundImage: 'url(/assets/lion_alvart_v2.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
          opacity: 0.96,
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.8))'
        }}></div>

        {/* Diagonal dynamic red accent line behind slogan */}
        <div style={{
          position: 'absolute',
          left: '-20px',
          bottom: '70px',
          width: '180px',
          height: '3px',
          background: 'linear-gradient(to right, #d92121, transparent)',
          transform: 'rotate(-8deg)',
          zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 3, maxWidth: '170px' }}>
          <h2 style={{
            fontSize: '22px',
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            GRANDES<br />
            METAS,<br />
            <span style={{ color: '#d92121' }}>MEJORES<br />PERSONAS</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
