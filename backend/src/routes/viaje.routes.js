/**
 * Rutas de viajes: /api/viajes (todas protegidas con JWT)
 */
const { Router } = require('express');
const viajeController = require('../controllers/viaje.controller');
const {
  createRules,
  putRules,
  idRules,
  listRules,
  kilometrosRules,
} = require('../validators/viaje.validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', listRules, validate, viajeController.listar);
router.get('/kilometros/vehiculo/:id', kilometrosRules, validate, viajeController.kmPorVehiculo);
router.get('/kilometros/conductor/:id', kilometrosRules, validate, viajeController.kmPorConductor);
router.get('/:id', idRules, validate, viajeController.obtener);
router.post('/', createRules, validate, viajeController.crear);
router.put('/:id', putRules, validate, viajeController.actualizar);
router.delete('/:id', idRules, validate, viajeController.eliminar);

module.exports = router;
