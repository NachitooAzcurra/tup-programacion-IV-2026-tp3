/**
 * Validaciones del frontend para los formularios.
 * Devuelven un objeto { campo: mensaje } con los errores encontrados.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Patente argentina: vieja ABC123 o nueva AB123CD
const PATENTE_RE = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/;

export function validarRegistro({ nombre, email, password }) {
  const errores = {};
  if (!nombre || !nombre.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!email || !email.trim()) errores.email = 'El email es obligatorio';
  else if (!EMAIL_RE.test(email.trim())) errores.email = 'Formato de email inválido';
  if (!password) errores.password = 'La contraseña es obligatoria';
  else if (password.length < 6) errores.password = 'Mínimo 6 caracteres';
  return errores;
}

export function validarLogin({ email, password }) {
  const errores = {};
  if (!email || !email.trim()) errores.email = 'El email es obligatorio';
  else if (!EMAIL_RE.test(email.trim())) errores.email = 'Formato de email inválido';
  if (!password) errores.password = 'La contraseña es obligatoria';
  return errores;
}

export function validarVehiculo({ marca, modelo, patente, anio, capacidad_carga }) {
  const errores = {};
  if (!marca || !marca.trim()) errores.marca = 'La marca es obligatoria';
  if (!modelo || !modelo.trim()) errores.modelo = 'El modelo es obligatorio';
  if (!patente || !patente.trim()) errores.patente = 'La patente es obligatoria';
  else if (!PATENTE_RE.test(patente.trim().toUpperCase()))
    errores.patente = 'Formato inválido (ABC123 o AB123CD)';
  if (!anio) errores.anio = 'El año es obligatorio';
  else {
    const n = Number(anio);
    if (!Number.isInteger(n) || n < 1900 || n > 2100)
      errores.anio = 'Debe ser un año entre 1900 y 2100';
  }
  if (capacidad_carga === '' || capacidad_carga === undefined || capacidad_carga === null)
    errores.capacidad_carga = 'La capacidad de carga es obligatoria';
  else if (Number(capacidad_carga) <= 0)
    errores.capacidad_carga = 'Debe ser un número mayor a 0';
  return errores;
}

export function validarConductor({
  nombre,
  apellido,
  numero_documento,
  numero_licencia,
  fecha_alta_licencia,
  fecha_vencimiento_licencia,
}) {
  const errores = {};
  if (!nombre || !nombre.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!apellido || !apellido.trim()) errores.apellido = 'El apellido es obligatorio';
  if (!numero_documento || !String(numero_documento).trim())
    errores.numero_documento = 'El documento es obligatorio';
  else if (!/^\d{7,15}$/.test(String(numero_documento).trim()))
    errores.numero_documento = 'Solo números (7 a 15 dígitos)';
  if (!numero_licencia || !numero_licencia.trim())
    errores.numero_licencia = 'El número de licencia es obligatorio';
  if (!fecha_alta_licencia) errores.fecha_alta_licencia = 'La fecha de alta es obligatoria';
  if (!fecha_vencimiento_licencia)
    errores.fecha_vencimiento_licencia = 'La fecha de vencimiento es obligatoria';
  else if (
    fecha_alta_licencia &&
    new Date(fecha_vencimiento_licencia) < new Date(fecha_alta_licencia)
  )
    errores.fecha_vencimiento_licencia =
      'Debe ser posterior o igual a la fecha de alta';
  return errores;
}

export function validarViaje({
  vehiculo_id,
  conductor_id,
  fecha_salida,
  fecha_llegada,
  origen,
  destino,
  kilometros,
}) {
  const errores = {};
  if (!vehiculo_id) errores.vehiculo_id = 'Debe seleccionar un vehículo';
  if (!conductor_id) errores.conductor_id = 'Debe seleccionar un conductor';
  if (!fecha_salida) errores.fecha_salida = 'La fecha de salida es obligatoria';
  if (fecha_llegada && fecha_salida && new Date(fecha_llegada) < new Date(fecha_salida))
    errores.fecha_llegada = 'Debe ser posterior a la fecha de salida';
  if (!origen || !origen.trim()) errores.origen = 'El origen es obligatorio';
  if (!destino || !destino.trim()) errores.destino = 'El destino es obligatorio';
  if (kilometros === '' || kilometros === undefined || kilometros === null)
    errores.kilometros = 'Los kilómetros son obligatorios';
  else if (Number(kilometros) <= 0) errores.kilometros = 'Debe ser mayor a 0';
  return errores;
}
