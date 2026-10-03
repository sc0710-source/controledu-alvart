import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import webpush from 'web-push';
import db, { initDatabase } from './database.js';

// Obtengo las rutas del directorio para servir la PWA compilada
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

// Inicializo mi aplicación de servidor con Express y el puerto dinámico para la nube o local
const app = express();
const PORT = process.env.PORT || 3001;

// Habilito CORS para permitir peticiones desde mi cliente móvil y activo el lector de JSON
app.use(cors());
app.use(express.json());

// Arranco e inicializo la estructura completa de mi base de datos SQLite
initDatabase();

// Configuro mis claves VAPID para Web Push (comunicación con Apple APNs en iPhone y Google FCM en Android)
const VAPID_PUBLIC_KEY = 'BHPjZupVjpLFoI_YnDaMM4vpiKf4ww0C-El6s5BgRveUltGVdUkKKJDT9oO-htEPLVwNXySYrXAy2_QHIjfnQEU';
const VAPID_PRIVATE_KEY = 'gTR_hSP0O58WtoDYNXkCDf-sEKEUZwFZSZ-lq3yTAm4';

// Registro los detalles de contacto requeridos por el estándar RFC 8292 de VAPID
webpush.setVapidDetails(
  'mailto:notificaciones@alvart.edu.mx',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Función donde despacho notificaciones Push a los teléfonos de mis alumnos (incluso con pantalla apagada)
async function dispatchPushToStudents({ title, body, url = '/', data = {} }) {
  try {
    // Consulto todas las suscripciones activas registradas en mi base de datos
    const subscriptions = db.prepare('SELECT id, endpoint, p256dh, auth FROM push_subscriptions').all();
    if (!subscriptions || subscriptions.length === 0) return;

    // Construyo el paquete de datos que voy a mandar a los servidores de Apple y Google
    const payload = JSON.stringify({
      title,
      body,
      icon: '/assets/app_icon.png',
      badge: '/assets/app_icon.png',
      url,
      data
    });

    // Mando la orden de notificación a cada dispositivo registrado
    const sendPromises = subscriptions.map(async (sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushConfig, payload);
      } catch (err) {
        // Si el teléfono se dio de baja o expiró el token (códigos 410 o 404), lo elimino de mi base de datos
        if (err.statusCode === 410 || err.statusCode === 404) {
          db.prepare('DELETE FROM push_subscriptions WHERE id = ?').run(sub.id);
        } else {
          console.warn('Advertencia al enviar Web Push individual:', err.message);
        }
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (err) {
    console.error('Error general al despachar Web Push a los alumnos:', err);
  }
}

// 0. Endpoints donde gestiono la configuración de Web Push
// Entrego mi clave pública VAPID al teléfono cuando me la solicite
app.get('/api/vapid-public-key', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

// Guardo la suscripción única que me manda el teléfono del estudiante
app.post('/api/push-subscribe', (req, res) => {
  const { estudiante_id, subscription } = req.body;

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ error: 'La suscripción enviada no es válida' });
  }

  try {
    // Guardo o actualizo la suscripción en mi tabla push_subscriptions
    const insert = db.prepare(`
      INSERT INTO push_subscriptions (estudiante_id, endpoint, p256dh, auth)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET
        estudiante_id = excluded.estudiante_id,
        p256dh = excluded.p256dh,
        auth = excluded.auth
    `);

    insert.run(
      estudiante_id || 1,
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth
    );

    res.json({ success: true, message: 'Dispositivo registrado con éxito para notificaciones en segundo plano' });
  } catch (err) {
    console.error('Error al guardar suscripción push en la base de datos:', err);
    res.status(500).json({ error: 'Error al registrar suscripción' });
  }
});

// Endpoint donde ejecuto una notificación de prueba directa al dispositivo
app.post('/api/push-test', async (req, res) => {
  const { estudiante_id } = req.body;
  try {
    await dispatchPushToStudents({
      title: '🔔 Notificación de Prueba Alvart',
      body: 'Tu teléfono está sincronizado y recibirá avisos incluso con la app cerrada.',
      data: { tipo: 'test' }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Fallo al despachar notificación de prueba' });
  }
});

// 1. Endpoint donde proceso el inicio de sesión (alumno sc0710 o docente redes01)
app.post('/api/login', (req, res) => {
  const { matricula, usuario, password } = req.body;
  const userIdentifier = (matricula || usuario || '').trim();

  if (!userIdentifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Debes ingresar tu usuario y contraseña'
    });
  }

  // Busco al usuario de forma segura con consultas preparadas contra inyección SQL
  const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(userIdentifier);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'El usuario no se encuentra registrado en el sistema'
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Contraseña incorrecta. Por favor verifica tus datos'
    });
  }

  // Si las credenciales coinciden, retiro la contraseña del objeto que regreso al cliente
  const { password: _, ...userData } = user;

  res.json({
    success: true,
    user: userData
  });
});

// 2. Endpoints para gestionar las tareas escolares
// Obtengo el listado completo de tareas y agrego cuántos y quiénes ya las vieron
app.get('/api/tareas', (req, res) => {
  const tareas = db.prepare('SELECT * FROM tareas ORDER BY id DESC').all();

  const tareasConVistas = tareas.map((t) => {
    const vistas = db.prepare('SELECT estudiante_nombre, visto_en FROM tarea_vistas WHERE tarea_id = ?').all(t.id);
    return {
      ...t,
      vistasCount: vistas.length,
      vistas: vistas
    };
  });

  res.json(tareasConVistas);
});

// Aquí el profesor publica una nueva tarea
app.post('/api/tareas', (req, res) => {
  const { docente_id, materia, titulo, descripcion, fecha_entrega, prioridad } = req.body;

  if (!titulo || !materia || !fecha_entrega) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Guardo la nueva tarea en mi tabla de tareas
  const insert = db.prepare(`
    INSERT INTO tareas (docente_id, materia, titulo, descripcion, fecha_entrega, prioridad)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    docente_id || 2,
    materia,
    titulo,
    descripcion || '',
    fecha_entrega,
    prioridad || 'Normal'
  );

  // Genero la notificación correspondiente para todos los estudiantes en mi base de datos
  const estudiantes = db.prepare("SELECT id FROM usuarios WHERE rol = 'estudiante'").all();
  const notifStmt = db.prepare(`
    INSERT INTO notificaciones (estudiante_id, titulo, descripcion, fecha, tipo)
    VALUES (?, ?, ?, ?, ?)
  `);

  estudiantes.forEach((est) => {
    notifStmt.run(
      est.id,
      `Nueva Tarea: ${materia}`,
      `${titulo} - Entrega: ${fecha_entrega}`,
      'Hace un momento',
      'task'
    );
  });

  // Envío la orden de notificación Web Push a Apple y Google para que el celular del alumno suene
  dispatchPushToStudents({
    title: `📚 Nueva Tarea: ${materia}`,
    body: `${titulo} (Entrega: ${fecha_entrega})`,
    data: { tipo: 'task', id: result.lastInsertRowid }
  });

  res.json({
    success: true,
    tareaId: result.lastInsertRowid,
    message: 'Tarea publicada y notificación enviada a los alumnos'
  });
});

// Registro que un estudiante abrió la tarea (confirmación de lectura)
app.post('/api/tareas/:id/marcar-visto', (req, res) => {
  const tareaId = req.params.id;
  const { estudiante_id, estudiante_nombre } = req.body;

  if (!estudiante_id || !estudiante_nombre) {
    return res.status(400).json({ error: 'Datos de estudiante requeridos' });
  }

  try {
    db.prepare(`
      INSERT OR IGNORE INTO tarea_vistas (tarea_id, estudiante_id, estudiante_nombre)
      VALUES (?, ?, ?)
    `).run(tareaId, estudiante_id, estudiante_nombre);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar visualización' });
  }
});

// 3. Endpoints para el muro de anuncios y comentarios interactivos
// Obtengo todos los anuncios junto con los comentarios que tengan asociados
app.get('/api/anuncios', (req, res) => {
  const anuncios = db.prepare('SELECT * FROM anuncios ORDER BY id DESC').all();

  const anunciosConComentarios = anuncios.map((a) => {
    const comentarios = db.prepare('SELECT * FROM anuncio_comentarios WHERE anuncio_id = ? ORDER BY id ASC').all(a.id);
    return {
      ...a,
      comentarios
    };
  });

  res.json(anunciosConComentarios);
});

// Aquí el profesor publica un nuevo anuncio en el muro escolar
app.post('/api/anuncios', (req, res) => {
  const { docente_id, autor_nombre, materia, titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'Título y contenido requeridos' });
  }

  // Inserto el comunicado en mi tabla de anuncios
  const insert = db.prepare(`
    INSERT INTO anuncios (docente_id, autor_nombre, materia, titulo, contenido)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    docente_id || 2,
    autor_nombre || 'Prof. Mario Alberto Morales Z.',
    materia || 'Aviso General',
    titulo,
    contenido
  );

  // Registro el aviso en la tabla de notificaciones para el historial del alumno
  const estudiantes = db.prepare("SELECT id FROM usuarios WHERE rol = 'estudiante'").all();
  const notifStmt = db.prepare(`
    INSERT INTO notificaciones (estudiante_id, titulo, descripcion, fecha, tipo)
    VALUES (?, ?, ?, ?, ?)
  `);

  estudiantes.forEach((est) => {
    notifStmt.run(
      est.id,
      `Nuevo Anuncio: ${materia || 'General'}`,
      `${titulo}: ${contenido.substring(0, 60)}...`,
      'Hace un momento',
      'alert'
    );
  });

  // Mando el aviso por Web Push a los teléfonos de los alumnos
  dispatchPushToStudents({
    title: `📢 Nuevo Anuncio: ${materia || 'General'}`,
    body: `${titulo}: ${contenido.substring(0, 75)}`,
    data: { tipo: 'alert', id: result.lastInsertRowid }
  });

  res.json({
    success: true,
    anuncioId: result.lastInsertRowid,
    message: 'Anuncio publicado con éxito'
  });
});

// Aquí registro la respuesta que un alumno o profesor deja en un anuncio
app.post('/api/anuncios/:id/comentarios', (req, res) => {
  const anuncioId = req.params.id;
  const { usuario_id, autor_nombre, rol, comentario } = req.body;

  if (!comentario || !comentario.trim()) {
    return res.status(400).json({ error: 'El comentario no puede estar vacío' });
  }

  const insert = db.prepare(`
    INSERT INTO anuncio_comentarios (anuncio_id, usuario_id, autor_nombre, rol, comentario)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    anuncioId,
    usuario_id,
    autor_nombre,
    rol || 'estudiante',
    comentario.trim()
  );

  res.json({
    success: true,
    comentarioId: result.lastInsertRowid
  });
});

// 4. Endpoint donde consulto el historial de notificaciones de un alumno
app.get('/api/notificaciones/:estudiante_id', (req, res) => {
  const { estudiante_id } = req.params;
  const notifs = db.prepare('SELECT * FROM notificaciones WHERE estudiante_id = ? ORDER BY id DESC').all(estudiante_id);
  res.json(notifs);
});

// 5. Sirvo los archivos estáticos de la PWA compilada (dist/) para despliegue en la nube
app.use(express.static(distPath));

// Cualquier otra ruta que no sea de la API la canalizo hacia index.html (SPA)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

// Pongo a escuchar mi servidor en el puerto dinámico de la nube o localmente en el 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API de ControlEDU (Multi-rol con Web Push VAPID) corriendo en http://localhost:${PORT}`);
});
