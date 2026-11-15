/**
 * Validaciones con express-validator para las rutas de conductores.
 */
const { body, param } = require('express-validator');
const pool = require('../config/db');

const fechaISO = (campo, mensaje) =>
  body(campo)
    .notEmpty().withMessage(`${mensaje} es obligatoria`)
    .isISO8601({ strict: true }).withMessage(`${mensaje} debe tener formato YYYY-MM-DD`);

const createRules = [
  body('nombre')
    .trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres'),
  body('apellido')
    .trim().notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ max: 100 }).withMessage('El apellido no puede superar 100 caracteres'),
  body('numero_documento')
    .trim().notEmpty().withMessage('El número de documento es obligatorio')
    .isInt({ min: 1000000 }).withMessage('El documento debe ser numérico (mínimo 7 dígitos)')
    .isLength({ max: 15 }).withMessage('El documento no puede superar 15 caracteres'),
  body('numero_licencia')
    .trim().notEmpty().withMessage('El número de licencia es obligatorio')
    .isLength({ max: 20 }).withMessage('El número de licencia no puede superar 20 caracteres'),
  fechaISO('fecha_alta_licencia', 'La fecha de alta de licencia'),
  fechaISO('fecha_vencimiento_licencia', 'La fecha de vencimiento de licencia')
    .custom((venc, { req }) => {
      if (new Date(venc) < new Date(req.body.fecha_alta_licencia)) {
        throw new Error('La fecha de vencimiento debe ser posterior o igual a la de alta');
      }
      return true;
    }),
];

const putRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  ...createRules,
];

const idRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
];

module.exports = { createRules, putRules, idRules };
