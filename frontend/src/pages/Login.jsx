import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validarLogin } from '../utils/validations.js';
import { Campo, Alerta } from '../components/UI.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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

    const erroresForm = validarLogin(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    setCargando(true);
    try {
      const datos = await api.post('/auth/login', form);
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
        <h2>Iniciar sesión</h2>

        <Alerta mensaje={servidor?.mensaje || servidor} detalle={servidor?.detalle} />

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
            placeholder="********"
          />
        </Campo>

        <button className="btn btn-primario btn-bloque" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="auth-pie">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link> ·{' '}
          <Link to="/">Volver al inicio</Link>
        </p>
      </form>
    </div>
  );
}
