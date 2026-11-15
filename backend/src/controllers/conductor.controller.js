/**
 * Controlador CRUD de conductores (todas las rutas requieren JWT).
 */
const pool = require('../config/db');

/** GET /api/conductores */
async function listar(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(vj.id) AS total_viajes, COALESCE(SUM(vj.kilometros), 0) AS km_recorridos
       FROM conductores c
       LEFT JOIN viajes vj ON vj.conductor_id = c.id
       GROUP BY c.id
       ORDER BY c.id`
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

/** GET /api/conductores/:id */
async function obtener(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM conductores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** POST /api/conductores */
async function crear(req, res, next) {
  try {
    const {
      nombre,
      apellido,
      numero_documento,
      numero_licencia,
      fecha_alta_licencia,
      fecha_vencimiento_licencia,
    } = req.body;

    const [dupDoc] = await pool.query(
      'SELECT id FROM conductores WHERE numero_documento = ?',
      [numero_documento]
    );
    if (dupDoc.length > 0) {
      return res.status(409).json({ error: 'Ya existe un conductor con ese documento' });
    }

    const [dupLic] = await pool.query(
      'SELECT id FROM conductores WHERE numero_licencia = ?',
      [numero_licencia]
    );
    if (dupLic.length > 0) {
      return res.status(409).json({ error: 'Ya existe un conductor con esa licencia' });
    }

    const [result] = await pool.query(
      `INSERT INTO conductores
         (nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia]
    );

    const [rows] = await pool.query('SELECT * FROM conductores WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** PUT /api/conductores/:id */
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      numero_documento,
      numero_licencia,
      fecha_alta_licencia,
      fecha_vencimiento_licencia,
    } = req.body;

    const [existe] = await pool.query('SELECT id FROM conductores WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    const [dupDoc] = await pool.query(
      'SELECT id FROM conductores WHERE numero_documento = ? AND id <> ?',
      [numero_documento, id]
    );
    if (dupDoc.length > 0) {
      return res.status(409).json({ error: 'Ya existe otro conductor con ese documento' });
    }

    const [dupLic] = await pool.query(
      'SELECT id FROM conductores WHERE numero_licencia = ? AND id <> ?',
      [numero_licencia, id]
    );
    if (dupLic.length > 0) {
      return res.status(409).json({ error: 'Ya existe otro conductor con esa licencia' });
    }

    await pool.query(
      `UPDATE conductores SET
         nombre = ?, apellido = ?, numero_documento = ?, numero_licencia = ?,
         fecha_alta_licencia = ?, fecha_vencimiento_licencia = ?
       WHERE id = ?`,
      [nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia, id]
    );

    const [rows] = await pool.query('SELECT * FROM conductores WHERE id = ?', [id]);
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /api/conductores/:id */
async function eliminar(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM conductores WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    return res.json({ mensaje: 'Conductor eliminado correctamente' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
