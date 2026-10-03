import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtengo la ruta del directorio actual para localizar mi base de datos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Defino la ruta donde guardo mi archivo físico SQLite
const dbPath = path.join(__dirname, 'controledu.sqlite');

// Inicializo mi conexión a la base de datos SQLite con better-sqlite3
const db = new Database(dbPath);

// Habilito las llaves foráneas para mantener la integridad referencial de mis tablas
db.pragma('foreign_keys = ON');

// Función principal donde inicializo y construyo toda la estructura de mi base de datos
export function initDatabase() {
  db.exec(`
    -- 1. Aquí creo mi tabla de Usuarios (para estudiantes y docentes)
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombre TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'estudiante', -- almaceno si es 'estudiante' o 'docente'
      correo TEXT NOT NULL,
      telefono TEXT,
      carrera TEXT DEFAULT 'Ingeniería en Sistemas',
      semestre TEXT DEFAULT '7° Semestre',
      materia_titular TEXT, -- campo exclusivo donde guardo la materia del docente (ej: 'Redes III')
      promedio REAL DEFAULT 8.9,
      avatar TEXT DEFAULT '/assets/profile.png',
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Aquí creo mi tabla de Tareas que publican los profesores
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      docente_id INTEGER NOT NULL,
      materia TEXT NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      fecha_entrega TEXT NOT NULL,
      prioridad TEXT DEFAULT 'Normal',
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (docente_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );

    -- 3. Aquí creo mi tabla de Visualizaciones para saber qué alumnos vieron la tarea
    CREATE TABLE IF NOT EXISTS tarea_vistas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tarea_id INTEGER NOT NULL,
      estudiante_id INTEGER NOT NULL,
      estudiante_nombre TEXT NOT NULL,
      visto_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tarea_id) REFERENCES tareas (id) ON DELETE CASCADE,
      FOREIGN KEY (estudiante_id) REFERENCES usuarios (id) ON DELETE CASCADE,
      UNIQUE(tarea_id, estudiante_id)
    );

    -- 4. Aquí creo mi tabla de Anuncios para el muro escolar
    CREATE TABLE IF NOT EXISTS anuncios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      docente_id INTEGER NOT NULL,
      autor_nombre TEXT NOT NULL,
      materia TEXT NOT NULL,
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (docente_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );

    -- 5. Aquí creo mi tabla de Comentarios interactivos en los anuncios
    CREATE TABLE IF NOT EXISTS anuncio_comentarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anuncio_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      autor_nombre TEXT NOT NULL,
      rol TEXT NOT NULL,
      comentario TEXT NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (anuncio_id) REFERENCES anuncios (id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );

    -- 6. Aquí creo mi tabla de Notificaciones para el historial del alumno
    CREATE TABLE IF NOT EXISTS notificaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estudiante_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      fecha TEXT NOT NULL,
      tipo TEXT DEFAULT 'task',
      leida INTEGER DEFAULT 0,
      FOREIGN KEY (estudiante_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );

    -- 7. Aquí creo mi tabla de Horario de clases
    CREATE TABLE IF NOT EXISTS horario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      materia TEXT NOT NULL,
      dia TEXT NOT NULL,
      hora TEXT NOT NULL,
      aula TEXT NOT NULL DEFAULT 'Laboratorio 3 / Aula 12',
      profesor TEXT NOT NULL,
      color TEXT DEFAULT '#2f80ed',
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );

    -- 8. Aquí creo mi tabla de Suscripciones Web Push (para avisar al celular en segundo plano)
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estudiante_id INTEGER NOT NULL,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (estudiante_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );
  `);

  // Verifico si ya registré al estudiante sc0710; si no existe, lo inserto
  const userStmt = db.prepare('SELECT id FROM usuarios WHERE usuario = ?');
  let student = userStmt.get('sc0710');

  if (!student) {
    const insertUser = db.prepare(`
      INSERT INTO usuarios (usuario, password, nombre, rol, correo, telefono, carrera, semestre, promedio, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = insertUser.run(
      'sc0710',
      'alvart2025',
      'Marlon Gómez Pastrana',
      'estudiante',
      'marlon@alvart.edu.mx',
      '55 1234 5678',
      'Ingeniería en Sistemas',
      '7° Semestre',
      8.9,
      '/assets/profile.png'
    );
    student = { id: res.lastInsertRowid };
  } else {
    // Si ya existe, me aseguro de que mantenga la contraseña y el rol correctos
    db.prepare('UPDATE usuarios SET password = ?, rol = ? WHERE usuario = ?').run('alvart2025', 'estudiante', 'sc0710');
  }

  // Verifico si ya registré al docente redes01; si no existe, lo inserto
  let teacher = userStmt.get('redes01');

  if (!teacher) {
    const insertTeacher = db.prepare(`
      INSERT INTO usuarios (usuario, password, nombre, rol, correo, telefono, carrera, materia_titular, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = insertTeacher.run(
      'redes01',
      'alvart2025',
      'Prof. Mario Alberto Morales Z.',
      'docente',
      'mario.morales@alvart.edu.mx',
      '55 9876 5432',
      'Ingeniería en Sistemas',
      'Redes III',
      '/assets/lion_alvart_v2.png'
    );
    teacher = { id: res.lastInsertRowid };
  } else {
    // Si ya existe, actualizo su contraseña y rol
    db.prepare('UPDATE usuarios SET password = ?, rol = ? WHERE usuario = ?').run('alvart2025', 'docente', 'redes01');
  }

  // Inserto tareas semilla iniciales en caso de que la tabla esté vacía
  const existingTasks = db.prepare('SELECT count(*) as count FROM tareas').get().count;
  if (existingTasks === 0) {
    const insTask = db.prepare(`
      INSERT INTO tareas (docente_id, materia, titulo, descripcion, fecha_entrega, prioridad)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const t1 = insTask.run(
      teacher.id,
      'Redes III',
      'Práctica 4: Topología de Redes y VLANs (Cisco)',
      'Subir archivo .pkt de Packet Tracer con el esquema de red enrutado y funcionando.',
      'Sábado, 23:59 h',
      'Urgente'
    );

    insTask.run(
      teacher.id,
      'Redes III',
      'Investigación: Protocolo OSPF vs BGP',
      'Reporte de 3 páginas en formato IEEE sobre protocolos de enrutamiento dinámico.',
      'Próximo Martes, 18:00 h',
      'Normal'
    );

    // Registro la primera confirmación de lectura de prueba
    db.prepare(`
      INSERT OR IGNORE INTO tarea_vistas (tarea_id, estudiante_id, estudiante_nombre)
      VALUES (?, ?, ?)
    `).run(t1.lastInsertRowid, student.id, 'Marlon Gómez Pastrana');
  }

  // Inserto anuncios semilla en caso de que el muro esté vacío
  const existingAnnouncements = db.prepare('SELECT count(*) as count FROM anuncios').get().count;
  if (existingAnnouncements === 0) {
    const insAnn = db.prepare(`
      INSERT INTO anuncios (docente_id, autor_nombre, materia, titulo, contenido)
      VALUES (?, ?, ?, ?, ?)
    `);

    const ann = insAnn.run(
      teacher.id,
      'Prof. Mario Alberto Morales Z.',
      'Redes III',
      'Aviso importante sobre el Examen Parcial en Laboratorio 3',
      'Estimados alumnos, el examen parcial se aplicará este miércoles a las 17:00 h en el Laboratorio 3 / Aula 12. Traer su simulador Packet Tracer listo en sus laptops.'
    );

    // Agrego una respuesta de prueba del estudiante
    db.prepare(`
      INSERT INTO anuncio_comentarios (anuncio_id, usuario_id, autor_nombre, rol, comentario)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      ann.lastInsertRowid,
      student.id,
      'Marlon Gómez Pastrana',
      'estudiante',
      'Enterado profesor, muchas gracias por el aviso. ¿Podremos usar calculadora científica?'
    );
  }

  // Inserto notificaciones semilla iniciales para el estudiante
  const existingNotifs = db.prepare('SELECT count(*) as count FROM notificaciones WHERE estudiante_id = ?').get(student.id).count;
  if (existingNotifs === 0) {
    const insNotif = db.prepare(`
      INSERT INTO notificaciones (estudiante_id, titulo, descripcion, fecha, tipo)
      VALUES (?, ?, ?, ?, ?)
    `);
    insNotif.run(student.id, 'Nueva Tarea de Redes III', 'Prof. Morales publicó: Práctica 4: Topología de Redes y VLANs.', 'Hace 10 minutos', 'task');
    insNotif.run(student.id, 'Nuevo Anuncio en Redes III', 'Aviso importante sobre el Examen Parcial en Laboratorio 3.', 'Hace 30 minutos', 'alert');
  }
}

export default db;
