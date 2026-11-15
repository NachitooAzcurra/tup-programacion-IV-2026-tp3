/**
 * ABM de vehículos: alta, modificación y eliminación.
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { validarVehiculo } from '../utils/validations.js';
import { Campo, Alerta } from '../components/UI.jsx';

const VACIO = { marca: '', modelo: '', patente: '', anio: '', capacidad_carga: '' };

export default function Vehiculos() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});
  const [servidor, setServidor] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    try {
      setLista(await api.get('/vehiculos'));
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

  function empezarEdicion(v) {
    setEditandoId(v.id);
    setForm({
      marca: v.marca,
      modelo: v.modelo,
      patente: v.patente,
      anio: String(v.anio),
      capacidad_carga: String(v.capacidad_carga),
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
      anio: form.anio ? Number(form.anio) : '',
      capacidad_carga: form.capacidad_carga === '' ? '' : Number(form.capacidad_carga),
      patente: form.patente.toUpperCase(),
    };
    const erroresForm = validarVehiculo(datos);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    try {
      if (editandoId) {
        await api.put(`/vehiculos/${editandoId}`, datos);
      } else {
        await api.post('/vehiculos', datos);
      }
      cancelar();
      await cargar();
    } catch (err) {
      setServidor(err.detalle ? { mensaje: err.message, detalle: err.detalle } : err.message);
    }
  }

  async function eliminar(v) {
    if (!window.confirm(`¿Eliminar el vehículo ${v.marca} ${v.modelo} (${v.patente})?`)) return;
    setServidor(null);
    try {
      await api.delete(`/vehiculos/${v.id}`);
      if (editandoId === v.id) cancelar();
      await cargar();
    } catch (err) {
      setServidor(err.message);
    }
  }

  return (
    <div className="pagina">
      <h1>Vehículos</h1>

      <Alerta mensaje={servidor?.mensaje || servidor} detalle={servidor?.detalle} />

      <section className="tarjeta">
        <h2>{editandoId ? 'Modificar vehículo' : 'Nuevo vehículo'}</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <Campo label="Marca" name="marca" error={errores.marca}>
              <input id="marca" name="marca" value={form.marca} onChange={onChange} placeholder="Ford" />
            </Campo>
            <Campo label="Modelo" name="modelo" error={errores.modelo}>
              <input id="modelo" name="modelo" value={form.modelo} onChange={onChange} placeholder="Ranger XL" />
            </Campo>
            <Campo label="Patente" name="patente" error={errores.patente}>
              <input id="patente" name="patente" value={form.patente} onChange={onChange} placeholder="AB123CD" maxLength={10} />
            </Campo>
            <Campo label="Año" name="anio" error={errores.anio}>
              <input id="anio" name="anio" type="number" value={form.anio} onChange={onChange} placeholder="2024" min="1900" max="2100" />
            </Campo>
            <Campo label="Capacidad de carga (kg)" name="capacidad_carga" error={errores.capacidad_carga}>
              <input id="capacidad_carga" name="capacidad_carga" type="number" step="0.01" value={form.capacidad_carga} onChange={onChange} placeholder="1100" min="1" />
            </Campo>
          </div>
          <div className="form-acciones">
            <button className="btn btn-primario">{editandoId ? 'Guardar cambios' : 'Agregar vehículo'}</button>
            {editandoId && (
              <button type="button" className="btn btn-secundario" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {cargando ? (
        <p>Cargando vehículos...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Año</th>
              <th>Carga (kg)</th>
              <th>Viajes</th>
              <th>Km recorridos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={9} className="tabla-vacia">No hay vehículos registrados.</td>
              </tr>
            ) : (
              lista.map((v) => (
                <tr key={v.id} className={editandoId === v.id ? 'fila-activa' : ''}>
                  <td>{v.id}</td>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.patente}</td>
                  <td>{v.anio}</td>
                  <td>{v.capacidad_carga}</td>
                  <td>{v.total_viajes}</td>
                  <td>{Number(v.km_recorridos).toLocaleString('es-AR')}</td>
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
