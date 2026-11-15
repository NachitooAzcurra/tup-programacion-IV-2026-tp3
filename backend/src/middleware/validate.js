/**
 * Middleware que valida las reglas declaradas con express-validator.
 * Si hay errores responde 400 con el detalle de cada campo.
 */
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    error: 'Error de validación',
    detalle: errors.array().map((e) => ({
      campo: e.path,
      mensaje: e.msg,
    })),
  });
}

module.exports = validate;
