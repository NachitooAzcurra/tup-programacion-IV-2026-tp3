/**
 * Rutas de autenticación: /api/auth
 */
const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { registerRules, loginRules } = require('../validators/usuario.validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/registro', registerRules, validate, authController.registro);
router.post('/login', loginRules, validate, authController.login);
router.get('/perfil', authenticate, authController.perfil);

module.exports = router;
