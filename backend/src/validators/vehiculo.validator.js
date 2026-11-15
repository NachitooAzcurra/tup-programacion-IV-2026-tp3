/**
 * Validaciones con express-validator para las rutas de vehículos.
 */
const { body, param, query } = require('express-validator');

const patenteRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/;

const createRules = [
  body('marca')
    .trim().notEmpty().withMessage('La marca es obligatoria')
    .isLength({ max: 50 }).withMessage('La marca no puede superar 50 caracteres'),
  body('modelo')
    .trim().notEmpty().withMessage('El modelo es obligatorio')
    .isLength({ max: 50 }).withMessage('El modelo no puede superar 50 caracteres'),
  body('patente')
    .trim().notEmpty().withMessage('La patente es obligatoria')
    .toUpperCase()
    .matches(patenteRegex).withMessage('La patente debe tener formato "ABC123" o "AB123CD"'),
  body('anio')
    .notEmpty().withMessage('El año es obligatorio')
    .isInt({ min: 1900, max: 2100 }).withMessage('El año debe ser un entero entre 1900 y 2100'),
  body('capacidad_carga')
    .notEmpty().withMessage('La capacidad de carga es obligatoria')
    .isFloat({ min: 1 }).withMessage('La capacidad de carga debe ser un número mayor a 0'),
];

const createRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  ...createRules,
];

const idRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
];

module.exports = { createRules, putRules, idRules };
