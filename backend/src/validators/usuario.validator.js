/**
 * Validaciones con express-validator para las rutas de usuarios (auth).
 */
const { body } = require('express-validator');

const registerRules = [
  body('nombre')
    .trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres'),
  body('email')
    .trim().notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginRules = [
  body('email')
    .trim().notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no tiene un formato válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = { registerRules, loginRules };
