/**
 * Controlador CRUD de viajes, historial y totales de kilómetros.
 * Todas las rutas requieren JWT.
 */
const pool = require('../config/db');

const SELECT_VIAJES = `
  SELECT vj.*, 
         vh.marca, vh.modelo, vh.patente,
         CONCAT(c.nombre, ' ', c.apellido) AS conductor
  FROM viajes vj
  JOIN vehiculos vh ON vh.id = vj.vehiculo_id
  JOIN conductores c ON c.id = vj.conductor_id`;

/** GET /api/viajes?vehiculo_id=&conductor_id= */
async function listar(req, res, next) {
  try {
    const { vehiculo_id, conductor_id } = req.query;
    const condiciones = [];
    const params = [];

    if (vehiculo_id) {
      condiciones.push('vj.vehiculo_id = ?');
      params.push(vehiculo_id);
    }
    if (conductor_id) {
      condiciones.push('vj.conductor_id = ?');
      params.push(conductor_id);
    }

    const sql = `${SELECT_VIAJES} ${condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : ''}
      ORDER BY vj.fecha_salida DESC`;
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

/** GET /api/viajes/:id */
async function obtener(req, res, next) {
  try {
    const [rows] = await pool.query(`${SELECT_VIAJES} WHERE vj.id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** POST /api/viajes */
async function crear(req, res, next) {
  try {
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;

    const [result] = await pool.query(
      `INSERT INTO viajes
         (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [vehiculo_id, conductor_id, fecha_salida, fecha_llegada || null, origen, destino, kilometros, observaciones || null]
    );

    const [rows] = await pool.query(`${SELECT_VIAJES} WHERE vj.id = ?`, [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** PUT /api/viajes/:id */
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;

    const [existe] = await pool.query('SELECT id FROM viajes WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    await pool.query(
      `UPDATE viajes SET
         vehiculo_id = ?, conductor_id = ?, fecha_salida = ?, fecha_llegada = ?,
         origen = ?, destino = ?, kilometros = ?, observaciones = ?
       WHERE id = ?`,
      [vehiculo_id, conductor_id, fecha_salida, fecha_llegada || null, origen, destino, kilometros, observaciones || null, id]
    );

    const [rows] = await pool.query(`${SELECT_VIAJES} WHERE vj.id = ?`, [id]);
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /api/viajes/:id */
async function eliminar(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM viajes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    return res.json({ mensaje: 'Viaje eliminado correctamente' });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/viajes/kilometros/vehiculo/:id - total de km por vehículo */
async function kmPorVehiculo(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT vh.id, vh.marca, vh.modelo, vh.patente,
              COALESCE(SUM(vj.kilometros), 0) AS total_kilometros,
              COUNT(vj.id) AS cantidad_viajes
       FROM vehiculos vh
       LEFT JOIN viajes vj ON vj.vehiculo_id = vh.id
       WHERE vh.id = ?
       GROUP BY vh.id`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** GET /api/viajes/kilometros/conductor/:id - total de km por conductor */
async function kmPorConductor(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, CONCAT(c.nombre, ' ', c.apellido) AS conductor,
              COALESCE(SUM(vj.kilometros), 0) AS total_kilometros,
              COUNT(vj.id) AS cantidad_viajes
       FROM conductores c
       LEFT JOIN viajes vj ON vj.conductor_id = c.id
       WHERE c.id = ?
       GROUP BY c.id`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar, kmPorVehiculo, kmPorConductor };
