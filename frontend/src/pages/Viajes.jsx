/**
 * Registro de viajes, asociando un vehículo y un conductor,
 * con filtros para ver el historial por vehículo o por conductor.
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { validarViaje } from '../utils/validations.js';
import { Campo, Alerta } from '../components/UI.jsx';

const VACIO = {
  vehiculo_id: '',
  conductor_id: '',
  fecha_salida: '',
  fecha_llegada: '',
  origen: '',
  destino: '',
  kilometros: '',
  observaciones: '',
};

function formatoFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const [servidor, setServidor] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtroVehiculo, setFiltroVehiculo] = useState('');
  const [filtroConductor, setFiltroConductor] = useState('');

  async function cargar() {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (filtroVehiculo) params.set('vehiculo_id', filtroVehiculo);
      if (filtroConductor) params.set('conductor_id', filtroConductor);
      const query = params.toString();
      setViajes(await api.get(`/viajes${query ? `?${query}` : ''}`));
      setServidor(null);
    } catch (err) {
      setServidor(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroVehiculo, filtroConductor]);

  useEffect(() => {
    api.get('/vehiculos').then(setVehiculos).catch(() => {});
    api.get('/conductores').then(setConductores).catch(() => {});
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function empezarEdicion(v) {
    setEditandoId(v.id);
    setForm({
      vehiculo_id: String(v.vehiculo_id),
      conductor_id: String(v.conductor_id),
      fecha_salida: v.fecha_salida?.slice(0, 16) || '',
      fecha_llegada: v.fecha_llegada?.slice(0, 16) || '',
      origen: v.origen,
      destino: v.destino,
      kilometros: String(v.kilometros),
      observaciones: v.observaciones || '',
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

    const datos = {
      ...form,
      vehiculo_id: form.vehiculo_id ? Number(form.vehiculo_id) : '',
      conductor_id: form.conductor_id ? Number(form.conductor_id) : '',
      kilometros: form.kilometros === '' ? '' : Number(form.kilometros),
      fecha_salida: form.fecha_salida ? form.fecha_salida.replace('T', ' ') + ':00' : '',
      fecha_llegada: form.fecha_llegada
        ? form.fecha_llegada.replace('T', ' ') + ':00'
        : null,
    };
    const erroresForm = validarViaje(datos);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    try {
      if (editandoId) {
        await api.put(`/viajes/${editandoId}`, datos);
      } else {
        await api.post('/viajes', datos);
      }
      cancelar();
      await cargar();
    } catch (err) {
      setServidor(err.detalle ? { mensaje: err.message, detalle: err.detalle } : err.message);
    }
  }

  async function eliminar(v) {
    if (!window.confirm(`¿Eliminar el viaje de ${v.origen} a ${v.destino}?`)) return;
    setServidor(null);
    try {
      await api.delete(`/viajes/${v.id}`);
      if (editandoId === v.id) cancelar();
      await cargar();
    } catch (err) {
      setServidor(err.message);
    }
  }

  return (
    <div className="pagina">
      <h1>🗺️ Viajes</h1>

      <Alerta mensaje={servidor?.mensaje || servidor} detalle={servidor?.detalle} />

      <section className="tarjeta">
        <h2>{editandoId ? 'Modificar viaje' : 'Registrar viaje'}</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <Campo label="Vehículo" name="vehiculo_id" error={errores.vehiculo_id}>
              <select id="vehiculo_id" name="vehiculo_id" value={form.vehiculo_id} onChange={onChange}>
                <option value="">Seleccionar vehículo...</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marca} {v.modelo} ({v.patente})
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Conductor" name="conductor_id" error={errores.conductor_id}>
              <select id="conductor_id" name="conductor_id" value={form.conductor_id} onChange={onChange}>
                <option value="">Seleccionar conductor...</option>
                {conductores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Fecha de salida" name="fecha_salida" error={errores.fecha_salida}>
              <input id="fecha_salida" name="fecha_salida" type="datetime-local" value={form.fecha_salida} onChange={onChange} />
            </Campo>
            <Campo label="Fecha de llegada (opcional)" name="fecha_llegada" error={errores.fecha_llegada}>
              <input id="fecha_llegada" name="fecha_llegada" type="datetime-local" value={form.fecha_llegada} onChange={onChange} />
            </Campo>
            <Campo label="Origen" name="origen" error={errores.origen}>
              <input id="origen" name="origen" value={form.origen} onChange={onChange} placeholder="La Rioja" />
            </Campo>
            <Campo label="Destino" name="destino" error={errores.destino}>
              <input id="destino" name="destino" value={form.destino} onChange={onChange} placeholder="Córdoba" />
            </Campo>
            <Campo label="Kilómetros" name="kilometros" error={errores.kilometros}>
              <input id="kilometros" name="kilometros" type="number" step="0.1" value={form.kilometros} onChange={onChange} placeholder="104.5" min="0.1" />
            </Campo>
            <Campo label="Observaciones (opcional)" name="observaciones" error={errores.observaciones}>
              <input id="observaciones" name="observaciones" value={form.observaciones} onChange={onChange} placeholder="Entrega de mercadería" />
            </Campo>
          </div>
          <div className="form-acciones">
            <button className="btn btn-primario">{editandoId ? 'Guardar cambios' : 'Registrar viaje'}</button>
            {editandoId && (
              <button type="button" className="btn btn-secundario" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="filtros tarjeta">
        <h2>Historial / filtros</h2>
        <div className="form-grid">
          <Campo label="Por vehículo" name="filtroVehiculo">
            <select id="filtroVehiculo" name="filtroVehiculo" value={filtroVehiculo} onChange={(e) => setFiltroVehiculo(e.target.value)}>
              <option value="">Todos los vehículos</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} ({v.patente})
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Por conductor" name="filtroConductor">
            <select id="filtroConductor" name="filtroConductor" value={filtroConductor} onChange={(e) => setFiltroConductor(e.target.value)}>
              <option value="">Todos los conductores</option>
              {conductores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      </section>

      {cargando ? (
        <p>Cargando viajes...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Conductor</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Origen → Destino</th>
              <th>Km</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viajes.length === 0 ? (
              <tr>
                <td colSpan={9} className="tabla-vacia">No hay viajes con esos filtros.</td>
              </tr>
            ) : (
              viajes.map((v) => (
                <tr key={v.id} className={editandoId === v.id ? 'fila-activa' : ''}>
                  <td>{v.id}</td>
                  <td>{v.marca} {v.modelo} ({v.patente})</td>
                  <td>{v.conductor}</td>
                  <td>{formatoFecha(v.fecha_salida)}</td>
                  <td>{formatoFecha(v.fecha_llegada)}</td>
                  <td>{v.origen} → {v.destino}</td>
                  <td>{Number(v.kilometros).toLocaleString('es-AR')}</td>
                  <td>{v.observaciones || '—'}</td>
                  <td className="tabla-acciones">
                    <button className="btn btn-secundario" onClick={() => empezarEdicion(v)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => eliminar(v)}>Eliminar</button>
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
