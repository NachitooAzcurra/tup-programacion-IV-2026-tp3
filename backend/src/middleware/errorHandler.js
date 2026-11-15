/**
 * Manejo central de errores: traduce errores de MySQL y del servidor
 * a respuestas HTTP adecuadas (400, 403, 404, 500).
 */
const notFound = (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message || err);

  // Errores de integridad de MySQL
  switch (err.code) {
    case 'ER_DUP_ENTRY':
      return res.status(409).json({ error: 'Ya existe un registro con ese valor único (duplicado).' });
    case 'ER_NO_REFERENCED_ROW_2':
      return res.status(400).json({ error: 'El vehículo o conductor referenciado no existe.' });
    case 'ER_ROW_IS_REFERENCED_2':
      return res.status(403).json({
        error: 'No se puede eliminar: el registro tiene viajes asociados.',
      });
    default:
      break;
  }

  // Errores de mysql2 (con .code dentro de err)
  if (err.errno === 1451) {
    return res.status(403).json({ error: 'No se puede eliminar: el registro tiene viajes asociados.' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado en el cuerpo de la petición.' });
  }

  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };
