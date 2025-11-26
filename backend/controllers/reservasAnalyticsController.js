const db = require('../config/database');

const mapNumber = value => Number(value) || 0;

const CURRENT_MONTH_FILTER = `
  YEAR(fecha_reserva) = YEAR(CURDATE())
  AND MONTH(fecha_reserva) = MONTH(CURDATE())
`;

exports.getDashboard = async (_req, res) => {
  try {
    const queries = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM reserva'),
      db.query(`
        SELECT COALESCE(re.nombre, 'Sin estado') AS estado, COUNT(*) AS total
        FROM reserva r
        LEFT JOIN reservas_estado re ON re.id_estado = r.estado_id
        GROUP BY estado
        ORDER BY total DESC
      `),
      db.query(`SELECT COUNT(*) AS total FROM reserva WHERE ${CURRENT_MONTH_FILTER}`),
      db.query(`
        SELECT
          COALESCE(SUM(total_pagar), 0) AS ingresos,
          COALESCE(SUM(cantidad_estudiantes), 0) AS estudiantes
        FROM reserva
        WHERE ${CURRENT_MONTH_FILTER}
      `),
      db.query(`
        SELECT DATE_FORMAT(fecha_reserva, '%Y-%m') AS periodo,
               COUNT(*) AS reservas,
               COALESCE(SUM(total_pagar), 0) AS ingresos,
               COALESCE(SUM(cantidad_estudiantes), 0) AS estudiantes
        FROM reserva
        WHERE fecha_reserva >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
        GROUP BY periodo
        ORDER BY periodo ASC
      `),
      db.query(`
        SELECT
          r.id_reserva,
          r.fecha_reserva,
          r.total_pagar,
          r.cantidad_estudiantes,
          e.nombre AS escuela,
          p.nombre_plan AS programa,
          COALESCE(re.nombre, 'Sin estado') AS estado
        FROM reserva r
        LEFT JOIN escuelas e ON e.id_escuela = r.escuela_id
        LEFT JOIN programas_educativos p ON p.id_plan = r.id_plan
        LEFT JOIN reservas_estado re ON re.id_estado = r.estado_id
        ORDER BY r.created_at DESC
        LIMIT 8
      `)
    ]);

    const [totalRows] = queries[0];
    const [statusRows] = queries[1];
    const [currentMonthRows] = queries[2];
    const [monthSumsRows] = queries[3];
    const [monthlyRows] = queries[4];
    const [recentRows] = queries[5];

    const response = {
      totals: {
        overall: mapNumber(totalRows?.[0]?.total),
        currentMonth: mapNumber(currentMonthRows?.[0]?.total),
        revenueMonth: +parseFloat(monthSumsRows?.[0]?.ingresos || 0).toFixed(2),
        studentsMonth: mapNumber(monthSumsRows?.[0]?.estudiantes),
      },
      status: statusRows.map(row => ({
        estado: row.estado || 'Sin estado',
        total: mapNumber(row.total),
      })),
      monthly: monthlyRows.map(row => ({
        periodo: row.periodo,
        reservas: mapNumber(row.reservas),
        ingresos: +parseFloat(row.ingresos || 0).toFixed(2),
        estudiantes: mapNumber(row.estudiantes),
      })),
      recent: recentRows.map(row => ({
        id_reserva: row.id_reserva,
        escuela: row.escuela || 'Sin escuela',
        programa: row.programa || 'Programa sin nombre',
        fecha_reserva: row.fecha_reserva,
        estado: row.estado || 'Sin estado',
        total_pagar: +parseFloat(row.total_pagar || 0).toFixed(2),
        cantidad_estudiantes: mapNumber(row.cantidad_estudiantes),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener dashboard de reservas:', error);
    res.status(500).json({
      message: 'No fue posible obtener el dashboard de reservas',
    });
  }
};
