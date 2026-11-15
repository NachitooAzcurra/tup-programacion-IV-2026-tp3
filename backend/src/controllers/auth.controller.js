/**
 * Controlador de autenticación: registro, login y perfil.
 * Las contraseñas se hashean con bcrypt y nunca se devuelven.
 */
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateToken } = require('../middleware/auth');

const SALT_ROUNDS = 10;

/** POST /api/auth/registro */
async function registro(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    const [existe] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );

    const usuario = { id: result.insertId, nombre, email };
    const token = generateToken(usuario);

    return res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario, token });
  } catch (err) {
    return next(err);
  }
}

/** POST /api/auth/login */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];
    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(usuario);
    return res.json({
      mensaje: 'Inicio de sesión correcto',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/auth/perfil (protegida) */
function perfil(req, res) {
  return res.json({ usuario: req.user });
}

module.exports = { registro, login, perfil };
