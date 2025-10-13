const db = require('../config/database');
const emailService = require('../services/emailService');

// Crear una nueva reserva educativa
exports.crearReserva = async (req, res) => {
  const { institucion, correo, programa, fecha, personas, comentarios } = req.body;

  try {
    // Validar datos requeridos
    if (!institucion || !correo || !programa || !fecha || !personas) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    // 1. Buscar o crear la escuela
    let escuela_id;
    const [escuelas] = await db.query(
      'SELECT id_escuela FROM escuelas WHERE nombre = ?',
      [institucion]
    );

    if (escuelas.length > 0) {
      escuela_id = escuelas[0].id_escuela;
    } else {
      // Crear nueva escuela
      const [result] = await db.query(
        'INSERT INTO escuelas (nombre, email) VALUES (?, ?)',
        [institucion, correo]
      );
      escuela_id = result.insertId;
    }

    // 2. Buscar el programa educativo
    const [programas] = await db.query(
      'SELECT id_plan, monto_por_persona, iva_porcentaje FROM programas_educativos WHERE nombre_plan = ? AND visible = 1',
      [programa]
    );

    if (programas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Programa educativo no encontrado'
      });
    }

    const { id_plan, monto_por_persona, iva_porcentaje } = programas[0];

    // 3. Calcular totales
    const cantidad_estudiantes = parseInt(personas);
    const cantidad_docentes = 0; // Ajustar si necesitas campo separado
    const total_bruto = monto_por_persona * cantidad_estudiantes;
    const total_iva = (total_bruto * iva_porcentaje) / 100;
    const total_pagar = total_bruto + total_iva;

    // 4. Obtener estado inicial (asumimos 1 = Pendiente)
    const estado_id = 1;

    // 5. Crear la reserva
    const [reservaResult] = await db.query(
      `INSERT INTO reserva (
        id_plan, escuela_id, fecha_reserva, hora_entrada, hora_termino,
        cantidad_estudiantes, cantidad_docentes, total_bruto, total_iva,
        total_pagar, estado_id, observaciones
      ) VALUES (?, ?, ?, '09:00:00', '17:00:00', ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_plan,
        escuela_id,
        fecha,
        cantidad_estudiantes,
        cantidad_docentes,
        total_bruto,
        total_iva,
        total_pagar,
        estado_id,
        comentarios || null
      ]
    );

    // Preparar datos de la reserva para los emails
    const reservaData = {
      escuela: institucion,
      email: correo,
      programa: programa,
      fecha: fecha,
      cantidad: personas,
      comentarios: comentarios,
      total: total_pagar.toFixed(2)
    };

    // Enviar emails (no bloqueante - se ejecuta en background)
    Promise.all([
      emailService.enviarEmailNuevaReservaAdmin(reservaData),
      emailService.enviarEmailConfirmacionReserva(reservaData)
    ]).catch(err => console.error('⚠️  Error al enviar emails de reserva:', err));

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: {
        id_reserva: reservaResult.insertId,
        total_pagar: total_pagar.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la reserva',
      error: error.message
    });
  }
};

// Obtener todas las reservas (para el panel admin)
exports.obtenerReservas = async (req, res) => {
  try {
    const [reservas] = await db.query(`
      SELECT
        r.id_reserva,
        r.fecha_reserva,
        r.cantidad_estudiantes,
        r.total_pagar,
        e.nombre as escuela,
        p.nombre_plan as programa,
        rs.nombre as estado,
        r.created_at
      FROM reserva r
      LEFT JOIN escuelas e ON r.escuela_id = e.id_escuela
      LEFT JOIN programas_educativos p ON r.id_plan = p.id_plan
      LEFT JOIN reservas_estado rs ON r.estado_id = rs.id_estado
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      data: reservas
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservas',
      error: error.message
    });
  }
};

// Obtener programas educativos disponibles
exports.obtenerProgramas = async (req, res) => {
  try {
    const [programas] = await db.query(`
      SELECT
        id_plan,
        nombre_plan,
        monto_por_persona,
        tiempo_programa,
        descripcion,
        min_estudiantes,
        max_estudiantes
      FROM programas_educativos
      WHERE visible = 1
      ORDER BY id_plan
    `);

    res.json({
      success: true,
      data: programas
    });

  } catch (error) {
    console.error('Error al obtener programas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener programas',
      error: error.message
    });
  }
};
