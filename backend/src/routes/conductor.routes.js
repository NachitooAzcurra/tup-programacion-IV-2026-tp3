/**
 * Rutas de conductores: /api/conductores (todas protegidas con JWT)
 */
const { Router } = require('express');
const conductorController = require('../controllers/conductor.controller');
const { createRules, putRules, idRules } = require('../validators/conductor.validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', conductorController.listar);
router.get('/:id', idRules, validate, conductorController.obtener);
router.post('/', createRules, validate, conductorController.crear);
router.put('/:id', putRules, validate, conductorController.actualizar);
router.delete('/:id', idRules, validate, conductorController.eliminar);

module.exports = router;
