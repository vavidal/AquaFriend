const db = require('../config/database');

const KNOWN_TYPES = ['pez', 'mamifero', 'ave', 'reptil'];

const normalizeLabel = (value, fallback = 'Sin registro') => {
  if (value === null || value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
};

const buildTypeTotals = rows => {
  const totals = KNOWN_TYPES.reduce((acc, tipo) => {
    acc[tipo] = 0;
    return acc;
  }, { otros: 0 });

  rows.forEach(row => {
    const tipo = normalizeLabel(row.tipo || 'otros', 'otros').toLowerCase();
    if (totals.hasOwnProperty(tipo)) {
      totals[tipo] = Number(row.total) || 0;
    } else {
      totals.otros += Number(row.total) || 0;
    }
  });

  return totals;
};

exports.getDashboard = async (_req, res) => {
  try {
    const queries = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM especies'),
      db.query(`
        SELECT COALESCE(NULLIF(TRIM(tipo), ''), 'Sin tipo') AS tipo, COUNT(*) AS total
        FROM especies
        GROUP BY tipo
        ORDER BY total DESC
      `),
      db.query(`
        SELECT COUNT(DISTINCT NULLIF(TRIM(habitat), '')) AS total
        FROM especies
      `),
      db.query(`
        SELECT COUNT(*) AS total
        FROM especies
        WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `),
      db.query(`
        SELECT COALESCE(NULLIF(TRIM(habitat), ''), 'Sin registro') AS habitat, COUNT(*) AS total
        FROM especies
        GROUP BY habitat
        ORDER BY total DESC
      `),
      db.query(`
        SELECT DATE_FORMAT(fecha_registro, '%Y-%m') AS periodo, COUNT(*) AS total
        FROM especies
        WHERE fecha_registro IS NOT NULL
        GROUP BY DATE_FORMAT(fecha_registro, '%Y-%m')
        ORDER BY periodo ASC
      `),
      db.query(`
        SELECT
          id_especie AS id,
          nombre_comun,
          tipo,
          habitat,
          estado_conservacion,
          fecha_registro
        FROM especies
        ORDER BY fecha_registro DESC
      `)
    ]);

    const [totalRows] = queries[0];
    const [byTypeRows] = queries[1];
    const [habitatCountRows] = queries[2];
    const [recentRows] = queries[3];
    const [habitatRows] = queries[4];
    const [monthlyRows] = queries[5];
    const [listRows] = queries[6];

    const normalizedTypeRows = byTypeRows.map(row => ({
      tipo: normalizeLabel(row.tipo, 'Sin tipo'),
      total: Number(row.total) || 0
    }));

    const response = {
      totals: {
        overall: totalRows?.[0]?.total || 0,
        byType: buildTypeTotals(byTypeRows),
        habitats: habitatCountRows?.[0]?.total || 0,
        recent30: recentRows?.[0]?.total || 0
      },
      charts: {
        byType: normalizedTypeRows,
        byHabitat: habitatRows.map(row => ({
          habitat: normalizeLabel(row.habitat),
          total: Number(row.total) || 0
        })),
        monthly: monthlyRows
          .filter(row => row.periodo)
          .map(row => ({
            periodo: row.periodo,
            total: Number(row.total) || 0
          }))
      },
      list: listRows.map(row => ({
        id: row.id,
        nombre_comun: row.nombre_comun,
        tipo: row.tipo || 'sin tipo',
        habitat: row.habitat || 'Sin registro',
        estado_conservacion: row.estado_conservacion || 'No informado',
        fecha_registro: row.fecha_registro
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener el dashboard de especies', error);
    res.status(500).json({
      message: 'No fue posible obtener el dashboard de especies',
    });
  }
};
