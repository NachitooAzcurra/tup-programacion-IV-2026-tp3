/**
 * Validaciones con express-validator para las rutas de viajes.
 */
const { body, param, query } = require('express-validator');
const pool = require('../config/db');

/** Comprueba que el id exista en la tabla indicada. */
function existeEn(tabla, mensaje) {
  return (value) => {
    if (value === undefined || value === '') return true;
    return pool
      .query(`SELECT id FROM ${tabla} WHERE id = ?`, [value])
      .then(([rows]) => {
        if (rows.length === 0) throw new Error(mensaje);
        return true;
      });
  };
}

const createRules = [
  body('vehiculo_id')
    .notEmpty().withMessage('El vehículo es obligatorio')
    .isInt({ min: 1 }).withMessage('El id de vehículo debe ser un entero positivo')
    .custom(existeEn('vehiculos', 'El vehículo indicado no existe')),
  body('conductor_id')
    .notEmpty().withMessage('El conductor es obligatorio')
    .isInt({ min: 1 }).withMessage('El id de conductor debe ser un entero positivo')
    .custom(existeEn('conductores', 'El conductor indicado no existe')),
  body('fecha_salida')
    .notEmpty().withMessage('La fecha de salida es obligatoria')
    .isISO8601({ strict: true }).withMessage('La fecha de salida debe tener formato ISO (YYYY-MM-DDTHH:mm:ss)'),
  body('fecha_llegada')
    .optional({ values: 'null' })
    .isISO8601({ strict: true }).withMessage('La fecha de llegada debe tener formato ISO')
    .custom((llegada, { req }) => {
      if (req.body.fecha_salida && new Date(llegada) < new Date(req.body.fecha_salida)) {
        throw new Error('La fecha de llegada debe ser posterior a la de salida');
      }
      return true;
    }),
  body('origen')
    .trim().notEmpty().withMessage('El origen es obligatorio')
    .isLength({ max: 150 }).withMessage('El origen no puede superar 150 caracteres'),
  body('destino')
    .trim().notEmpty().withMessage('El destino es obligatorio')
    .isLength({ max: 150 }).withMessage('El destino no puede superar 150 caracteres'),
  body('kilometros')
    .notEmpty().withMessage('Los kilómetros son obligatorios')
    .isFloat({ min: 0.1 }).withMessage('Los kilómetros deben ser un número mayor a 0'),
  body('observaciones')
    .optional({ values: 'null' })
    .isLength({ max: 1000 }).withMessage('Las observaciones no pueden superar 1000 caracteres'),
];

const putRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  ...createRules,
];

const idRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
];

/** Validación para GET /viajes con filtros por query string. */
const listRules = [
  query('vehiculo_id').optional().isInt({ min: 1 }).withMessage('vehiculo_id debe ser un entero positivo'),
  query('conductor_id').optional().isInt({ min: 1 }).withMessage('conductor_id debe ser un entero positivo'),
];

const kilometrosRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
];

module.exports = { createRules, putRules, idRules, listRules, kilometrosRules };
