/**
 * Autenticación y autorización con Passport + JWT.
 * La estrategia jwt verifica el header "Authorization: Bearer <token>"
 * contra la clave secreta y comprueba que el usuario exista.
 */
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const pool = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_tp3_programacion_iv';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '4h';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, email FROM usuarios WHERE id = ?',
        [payload.id]
      );
      if (rows.length === 0) {
        return done(null, false); // token válido pero usuario inexistente
      }
      return done(null, rows[0]);
    } catch (err) {
      return done(err, false);
    }
  })
);

/** Middleware para proteger rutas: exige un JWT válido. */
const authenticate = passport.authenticate('jwt', { session: false });

/** Genera un token que expira a las 4 horas. */
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

module.exports = { passport, authenticate, generateToken };
