/**
 * ABM de conductores: alta, modificación y eliminación.
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { validarConductor } from '../utils/validations.js';
import { Campo, Alerta } from '../components/UI.jsx';

const VACIO = {
  nombre: '',
  apellido: '',
  numero_documento: '',
  numero_licencia: '',
  fecha_alta_licencia: '',
  fecha_vencimiento_licencia: '',
};

export default function Conductores() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const [servidor, setServidor] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    try {
      setLista(await api.get('/conductores'));
      setServidor(null);
    } catch (err) {
      setServidor(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function empezarEdicion(c) {
    setEditandoId(c.id);
    setForm({
      nombre: c.nombre,
      apellido: c.apellido,
      numero_documento: c.numero_documento,
      numero_licencia: c.numero_licencia,
      fecha_alta_licencia: c.fecha_alta_licencia?.slice(0, 10) || '',
      fecha_vencimiento_licencia: c.fecha_vencimiento_licencia?.slice(0, 10) || '',
    });
    setErrores({});
    setServidor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
    setErrores({});
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServidor(null);

    const erroresForm = validarConductor(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    try {
      if (editandoId) {
        await api.put(`/conductores/${editandoId}`, form);
      } else {
        await api.post('/conductores', form);
      }
      cancelar();
      await cargar();
    } catch (err) {
      setServidor(err.detalle ? { mensaje: err.message, detalle: err.detalle } : err.message);
    }
  }

  async function eliminar(c) {
    if (!window.confirm(`¿Eliminar al conductor ${c.nombre} ${c.apellido}?`)) return;
    setServidor(null);
    try {
      await api.delete(`/conductores/${c.id}`);
      if (editandoId === c.id) cancelar();
      await cargar();
    } catch (err) {
      setServidor(err.message);
    }
  }

  return (
    <div className="pagina">
      <h1>Conductores</h1>

      <Alerta mensaje={servidor?.mensaje || servidor} detalle={servidor?.detalle} />

      <section className="tarjeta">
        <h2>{editandoId ? 'Modificar conductor' : 'Nuevo conductor'}</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <Campo label="Nombre" name="nombre" error={errores.nombre}>
              <input id="nombre" name="nombre" value={form.nombre} onChange={onChange} placeholder="Juan" />
            </Campo>
            <Campo label="Apellido" name="apellido" error={errores.apellido}>
              <input id="apellido" name="apellido" value={form.apellido} onChange={onChange} placeholder="Pérez" />
            </Campo>
            <Campo label="Nº de documento" name="numero_documento" error={errores.numero_documento}>
              <input id="numero_documento" name="numero_documento" value={form.numero_documento} onChange={onChange} placeholder="30123456" />
            </Campo>
            <Campo label="Nº de licencia" name="numero_licencia" error={errores.numero_licencia}>
              <input id="numero_licencia" name="numero_licencia" value={form.numero_licencia} onChange={onChange} placeholder="LIC-2024-001" />
            </Campo>
            <Campo label="Alta de licencia" name="fecha_alta_licencia" error={errores.fecha_alta_licencia}>
              <input id="fecha_alta_licencia" name="fecha_alta_licencia" type="date" value={form.fecha_alta_licencia} onChange={onChange} />
            </Campo>
            <Campo label="Vencimiento de licencia" name="fecha_vencimiento_licencia" error={errores.fecha_vencimiento_licencia}>
              <input id="fecha_vencimiento_licencia" name="fecha_vencimiento_licencia" type="date" value={form.fecha_vencimiento_licencia} onChange={onChange} />
            </Campo>
          </div>
          <div className="form-acciones">
            <button className="btn btn-primario">{editandoId ? 'Guardar cambios' : 'Agregar conductor'}</button>
            {editandoId && (
              <button type="button" className="btn btn-secundario" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {cargando ? (
        <p>Cargando conductores...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>Licencia</th>
              <th>Alta lic.</th>
              <th>Venc. lic.</th>
              <th>Viajes</th>
              <th>Km recorridos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={10} className="tabla-vacia">No hay conductores registrados.</td>
              </tr>
            ) : (
              lista.map((c) => (
                <tr key={c.id} className={editandoId === c.id ? 'fila-activa' : ''}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.apellido}</td>
                  <td>{c.numero_documento}</td>
                  <td>{c.numero_licencia}</td>
                  <td>{c.fecha_alta_licencia?.slice(0, 10)}</td>
                  <td>{c.fecha_vencimiento_licencia?.slice(0, 10)}</td>
                  <td>{c.total_viajes}</td>
                  <td>{Number(c.km_recorridos).toLocaleString('es-AR')}</td>
                  <td className="tabla-acciones">
                    <button className="btn btn-secundario" onClick={() => empezarEdicion(c)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => eliminar(c)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
