import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validarRegistro } from '../utils/validations.js';
import { Campo, Alerta } from '../components/UI.jsx';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [servidor, setServidor] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServidor(null);

    const erroresForm = validarRegistro(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    setCargando(true);
    try {
      const datos = await api.post('/auth/registro', form);
      login(datos.token, datos.usuario);
      navigate('/vehiculos');
    } catch (err) {
      setServidor(err.detalle ? { mensaje: err.message, detalle: err.detalle } : err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-pagina">
      <form className="auth-tarjeta" onSubmit={onSubmit} noValidate>
        <h2>Crear cuenta</h2>

        <Alerta mensaje={servidor?.mensaje || servidor} detalle={servidor?.detalle} />

        <Campo label="Nombre" name="nombre" error={errores.nombre}>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={onChange}
            placeholder="Nombre y apellido"
          />
        </Campo>

        <Campo label="Email" name="email" error={errores.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="tu@email.com"
          />
        </Campo>

        <Campo label="Contraseña" name="password" error={errores.password}>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Mínimo 6 caracteres"
          />
        </Campo>

        <button className="btn btn-primario btn-bloque" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarme'}
        </button>

        <p className="auth-pie">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}
