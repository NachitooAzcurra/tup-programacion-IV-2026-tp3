/**
 * Controlador CRUD de vehículos (todas las rutas requieren JWT).
 */
const pool = require('../config/db');

/** GET /api/vehiculos */
async function listar(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT v.*, COUNT(vj.id) AS total_viajes, COALESCE(SUM(vj.kilometros), 0) AS km_recorridos
       FROM vehiculos v
       LEFT JOIN viajes vj ON vj.vehiculo_id = v.id
       GROUP BY v.id
       ORDER BY v.id`
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

/** GET /api/vehiculos/:id */
async function obtener(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** POST /api/vehiculos */
async function crear(req, res, next) {
  try {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [duplicada] = await pool.query('SELECT id FROM vehiculos WHERE patente = ?', [patente]);
    if (duplicada.length > 0) {
      return res.status(409).json({ error: 'Ya existe un vehículo con esa patente' });
    }

    const [result] = await pool.query(
      'INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)',
      [marca, modelo, patente, anio, capacidad_carga]
    );

    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** PUT /api/vehiculos/:id */
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [existe] = await pool.query('SELECT id FROM vehiculos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    const [duplicada] = await pool.query(
      'SELECT id FROM vehiculos WHERE patente = ? AND id <> ?',
      [patente, id]
    );
    if (duplicada.length > 0) {
      return res.status(409).json({ error: 'Ya existe otro vehículo con esa patente' });
    }

    await pool.query(
      'UPDATE vehiculos SET marca = ?, modelo = ?, patente = ?, anio = ?, capacidad_carga = ? WHERE id = ?',
      [marca, modelo, patente, anio, capacidad_carga, id]
    );

    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id = ?', [id]);
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /api/vehiculos/:id */
async function eliminar(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM vehiculos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    return res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
