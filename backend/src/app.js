/**
 * Aplicación Express: middlewares globales, rutas y manejo de errores.
 */
const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta pública de bienvenida
app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST - TP3 Gestión de vehículos, conductores y viajes' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/vehiculos', require('./routes/vehiculo.routes'));
app.use('/api/conductores', require('./routes/conductor.routes'));
app.use('/api/viajes', require('./routes/viaje.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
