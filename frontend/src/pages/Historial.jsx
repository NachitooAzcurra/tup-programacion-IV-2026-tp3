/**
 * Historial de viajes por vehículo o por conductor,
 * con el total de kilómetros recorridos.
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Alerta } from '../components/UI.jsx';

export default function Historial() {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [tipo, setTipo] = useState('vehiculo');
  const [seleccion, setSeleccion] = useState('');
  const [viajes, setViajes] = useState([]);
  const [total, setTotal] = useState(null);
  const [servidor, setServidor] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    api.get('/vehiculos').then(setVehiculos).catch((e) => setServidor(e.message));
    api.get('/conductores').then(setConductores).catch((e) => setServidor(e.message));
  }, []);

  useEffect(() => {
    setSeleccion('');
    setViajes([]);
    setTotal(null);
  }, [tipo]);

  async function consultar(e) {
    e.preventDefault();
    if (!seleccion) {
      setServidor('Seleccioná un ' + (tipo === 'vehiculo' ? 'vehículo' : 'conductor'));
      return;
    }
    setServidor(null);
    setCargando(true);
    try {
      const [lista, resumen] = await Promise.all([
        api.get(`/viajes?${tipo}_id=${seleccion}`),
        api.get(`/viajes/kilometros/${tipo}/${seleccion}`),
      ]);
      setViajes(lista);
      setTotal(resumen);
    } catch (err) {
      setServidor(err.message);
    } finally {
      setCargando(false);
    }
  }

  const opciones = tipo === 'vehiculo' ? vehiculos : conductores;

  return (
    <div className="pagina">
      <h1>📊 Historial y kilómetros</h1>

      <Alerta mensaje={servidor} />

      <section className="tarjeta">
        <h2>Consulta</h2>
        <div className="historial-tipos">
          <label className="radio">
            <input
              type="radio"
              name="tipo"
              checked={tipo === 'vehiculo'}
              onChange={() => setTipo('vehiculo')}
            />
            Por vehículo
          </label>
          <label className="radio">
            <input
              type="radio"
              name="tipo"
              checked={tipo === 'conductor'}
              onChange={() => setTipo('conductor')}
            />
            Por conductor
          </label>
        </div>

        <form onSubmit={consultar} className="historial-form">
          <div className="campo">
            <label htmlFor="seleccion">
              {tipo === 'vehiculo' ? 'Vehículo' : 'Conductor'}
            </label>
            <select
              id="seleccion"
              value={seleccion}
              onChange={(e) => setSeleccion(e.target.value)}
            >
              <option value="">
                Seleccionar {tipo === 'vehiculo' ? 'vehículo' : 'conductor'}...
              </option>
              {opciones.map((o) => (
                <option key={o.id} value={o.id}>
                  {tipo === 'vehiculo'
                    ? `${o.marca} ${o.modelo} (${o.patente})`
                    : `${o.nombre} ${o.apellido}`}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primario" disabled={cargando}>
            {cargando ? 'Consultando...' : 'Consultar'}
          </button>
        </form>
      </section>

      {total && (
        <section className="resumen-km">
          <div className="tarjeta resumen-tarjeta">
            <h3>Total de kilómetros</h3>
            <p className="resumen-numero">
              {Number(total.total_kilometros).toLocaleString('es-AR', {
                maximumFractionDigits: 2,
              })} km
            </p>
            <p className="resumen-detalle">
              {tipo === 'vehiculo'
                ? `${total.marca} ${total.modelo} (${total.patente})`
                : total.conductor}{' '}
              · {total.cantidad_viajes} viaje(s)
            </p>
          </div>
        </section>
      )}

      {viajes.length > 0 && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha salida</th>
              <th>Fecha llegada</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Km</th>
              <th>Vehículo</th>
              <th>Conductor</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((v) => (
              <tr key={v.id}>
                <td>{new Date(v.fecha_salida).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{v.fecha_llegada ? new Date(v.fecha_llegada).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                <td>{v.origen}</td>
                <td>{v.destino}</td>
                <td>{Number(v.kilometros).toLocaleString('es-AR')}</td>
                <td>{v.marca} {v.modelo} ({v.patente})</td>
                <td>{v.conductor}</td>
                <td>{v.observaciones || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {total && viajes.length === 0 && (
        <p className="tabla-vacia">Sin viajes registrados para esta selección.</p>
      )}
    </div>
  );
}
