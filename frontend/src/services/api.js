/**
 * Cliente de la API REST con fetch.
 * Agrega el token JWT (si existe) y normaliza los errores del backend.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

export function setSession(token, usuario) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function getUsuario() {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();

  const opciones = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const respuesta = await fetch(`${BASE_URL}${path}`, opciones);

  // Token vencido o inválido: cerrar sesión
  if (respuesta.status === 401) {
    clearSession();
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje = datos?.error || `Error ${respuesta.status}`;
    const error = new Error(mensaje);
    error.detalle = datos?.detalle;
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
