import { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Send, Bell } from 'lucide-react';

export default function Announcements({ user, onNavigate }) {
  // Manejo la lista de comunicados y el texto que escribe el estudiante para responder
  const [anuncios, setAnuncios] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  // Consulto los anuncios del muro desde mi servidor Express
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/anuncios');
      const data = await res.json();
      setAnuncios(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar mis anuncios:', err);
      setLoading(false);
    }
  };

  // Cargo los comunicados al iniciar la pantalla y los mantengo actualizados
  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 6000);
    return () => clearInterval(interval);
  }, []);

  // Envío la respuesta o duda del alumno al profesor
  const handleSendComment = async (anuncioId) => {
    const text = replyText[anuncioId];
    if (!text || !text.trim()) return;

    try {
      await fetch(`/api/anuncios/${anuncioId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user?.id || 1,
          autor_nombre: user?.nombre || 'Marlon Gómez Pastrana',
          rol: 'estudiante',
          comentario: text.trim()
        })
      });

      // Limpio el campo de texto y recargo la conversación
      setReplyText({ ...replyText, [anuncioId]: '' });
      fetchAnnouncements();
    } catch (err) {
      console.error('Error al publicar mi comentario:', err);
    }
  };

  return (
    <div className="anim-fade padded-bottom">
      {/* Cabecera del Muro de Anuncios */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        background: 'rgba(7, 11, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 40
      }}>
        <button
          onClick={() => onNavigate('home')}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 600 }}>Muro de Anuncios</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <div style={{ padding: '12px 20px' }}>
        <p style={{ fontSize: '13px', color: '#9aa5c4', marginBottom: '16px' }}>
          Avisos oficiales publicados por tus profesores de la carrera.
        </p>

        {/* Listado de publicaciones de los maestros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {anuncios.map((ann) => (
            <div
              key={ann.id}
              style={{
                background: '#151e36',
                borderRadius: '18px',
                padding: '18px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#d92121', fontWeight: 600 }}>
                  {ann.materia}
                </span>
                <span style={{ fontSize: '11px', color: '#8b95b3' }}>
                  {ann.creado_en.split(' ')[0]}
                </span>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                {ann.titulo}
              </h3>

              <div style={{ fontSize: '11.5px', color: '#2f80ed', fontWeight: 500, marginBottom: '10px' }}>
                Publicado por: {ann.autor_nombre}
              </div>

              <p style={{ fontSize: '13px', color: '#dbe2f5', lineHeight: 1.5, marginBottom: '16px' }}>
                {ann.contenido}
              </p>

              {/* Hilo de respuestas entre el profesor y los estudiantes */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <MessageSquare size={14} color="#9aa5c4" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#9aa5c4' }}>
                    Respuestas y Dudas ({ann.comentarios?.length || 0}):
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {ann.comentarios && ann.comentarios.length > 0 ? (
                    ann.comentarios.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: c.rol === 'docente' ? 'rgba(47, 128, 237, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          borderLeft: c.rol === 'docente' ? '3px solid #2f80ed' : '3px solid #d92121'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <strong style={{ fontSize: '12px', color: '#fff' }}>
                            {c.autor_nombre} {c.usuario_id === user?.id ? '(Tú)' : ''}
                          </strong>
                          <span style={{ fontSize: '10px', color: '#8b95b3' }}>
                            {c.rol === 'docente' ? 'Profesor' : 'Alumno'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#cfd7eb', margin: 0 }}>
                          {c.comentario}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '11.5px', color: '#657193', fontStyle: 'italic' }}>
                      Sé el primero en responder a este aviso.
                    </p>
                  )}
                </div>

                {/* Campo de texto donde el alumno redacta su duda o respuesta */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={replyText[ann.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [ann.id]: e.target.value })}
                    placeholder="Escribe tu respuesta al profesor..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleSendComment(ann.id)}
                    style={{
                      background: '#d92121',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '20px',
                      padding: '0 14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
