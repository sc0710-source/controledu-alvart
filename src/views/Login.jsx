import { useState } from 'react';
import { User, Lock, Eye, EyeOff, QrCode, AlertCircle, Loader2, GraduationCap, Briefcase } from 'lucide-react';
import AlvartLogo from '../components/AlvartLogo';

export default function Login({ onLoginSuccess }) {
  // Manejo el estado de visibilidad de la contraseña y los valores del formulario
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Proceso el envío del formulario de acceso contra mi backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usuario.trim() || !password) {
      setErrorMessage('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      // Envío las credenciales a mi endpoint de autenticación
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Credenciales inválidas');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      // Notifico a mi aplicación principal que el usuario inició sesión correctamente
      onLoginSuccess(data.user);
    } catch (err) {
      console.error('Tuve un error al conectar con mi servidor:', err);
      setErrorMessage('Error al conectar con el servidor.');
      setIsLoading(false);
    }
  };

  // Función de ayuda para llenar rápidamente los datos del estudiante Marlon Gómez
  const handleFillStudent = () => {
    setUsuario('sc0710');
    setPassword('alvart2025');
    setErrorMessage('');
  };

  // Función de ayuda para llenar rápidamente los datos del docente Mario Morales
  const handleFillTeacher = () => {
    setUsuario('redes01');
    setPassword('alvart2025');
    setErrorMessage('');
  };

  return (
    <div className="anim-fade" style={{ padding: '28px 24px', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Cabecera con el logotipo oficial de Universidad Alvart */}
        <div style={{ textAlign: 'center', marginTop: '2vh', marginBottom: '24px' }}>
          <AlvartLogo size={74} />
          <h1 style={{ fontSize: '15px', fontWeight: 400, letterSpacing: '2px', marginTop: '12px' }}>
            UNIVERSIDAD<br />
            <span style={{ fontWeight: 800, fontSize: '23px', letterSpacing: '3px' }}>ALVART</span>
          </h1>
        </div>

        {/* Título y descripción de mi portal */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Portal Institucional</h2>
          <p style={{ fontSize: '13px', color: '#9aa5c4', lineHeight: 1.4 }}>
            Inicia sesión como alumno o docente con tus credenciales de la base de datos.
          </p>
        </div>

        {/* Mensaje visual de error si las credenciales fallan */}
        {errorMessage && (
          <div style={{
            background: 'rgba(217, 33, 33, 0.18)',
            border: '1px solid rgba(217, 33, 33, 0.5)',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            color: '#ff6b6b',
            fontSize: '12.5px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario de credenciales */}
        <form onSubmit={handleSubmit}>
          {/* Campo para ingresar el usuario o matrícula */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8b95b3' }}>
              <User size={18} />
            </div>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario institucional (ej: sc0710 o redes01)"
              autoComplete="username"
              style={{
                width: '100%',
                padding: '16px 16px 16px 46px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: errorMessage ? '1px solid rgba(217, 33, 33, 0.6)' : '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '26px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {/* Campo para ingresar la contraseña con botón para alternar visibilidad */}
          <div style={{ position: 'relative', marginBottom: '18px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8b95b3' }}>
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '16px 48px 16px 46px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: errorMessage ? '1px solid rgba(217, 33, 33, 0.6)' : '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '26px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#8b95b3',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Botón principal de envío */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verificando usuario...</span>
              </>
            ) : (
              <span>Iniciar sesión</span>
            )}
          </button>

          {/* Botones de prueba rápida para alternar entre estudiante y docente */}
          <div style={{
            marginTop: '20px',
            padding: '14px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.12)'
          }}>
            <span style={{ fontSize: '11px', color: '#8b95b3', display: 'block', marginBottom: '8px' }}>
              Acceso rápido para demostración:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleFillStudent}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'rgba(217, 33, 33, 0.15)',
                  border: '1px solid rgba(217, 33, 33, 0.4)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <GraduationCap size={15} color="#d92121" />
                <span>Alumno: sc0710</span>
              </button>

              <button
                type="button"
                onClick={handleFillTeacher}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'rgba(47, 128, 237, 0.15)',
                  border: '1px solid rgba(47, 128, 237, 0.4)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Briefcase size={15} color="#2f80ed" />
                <span>Maestro: redes01</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Pie de página */}
      <div style={{ textAlign: 'center', padding: '16px 0 6px', fontSize: '12px', color: '#8b95b3' }}>
        ¿No tienes cuenta?{' '}
        <a href="#coordinator" style={{ color: '#2f80ed', textDecoration: 'none', fontWeight: 500 }}>
          Contacta a tu coordinador
        </a>
      </div>
    </div>
  );
}
