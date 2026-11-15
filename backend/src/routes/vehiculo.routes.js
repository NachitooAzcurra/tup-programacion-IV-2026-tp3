/**
 * Rutas de vehículos: /api/vehiculos (todas protegidas con JWT)
 */
const { Router } = require('express');
const vehiculoController = require('../controllers/vehiculo.controller');
const { createRules, putRules, idRules } = require('../validators/vehiculo.validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', vehiculoController.listar);
router.get('/:id', idRules, validate, vehiculoController.obtener);
router.post('/', createRules, validate, vehiculoController.crear);
router.put('/:id', putRules, validate, vehiculoController.actualizar);
router.delete('/:id', idRules, validate, vehiculoController.eliminar);

module.exports = router;
