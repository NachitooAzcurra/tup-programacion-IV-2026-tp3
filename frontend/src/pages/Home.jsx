import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { autenticado } = useAuth();

  return (
    <div className="home">
      <header className="home-hero">
        <h1>🚛 Control de Vehículos</h1>
        <p className="home-subtitulo">
          Sistema de gestión de vehículos, conductores y viajes para empresas de transporte.
        </p>
        <div className="home-acciones">
          {autenticado ? (
            <Link className="btn btn-primario" to="/vehiculos">
              Ir al panel
            </Link>
          ) : (
            <>
              <Link className="btn btn-primario" to="/login">
                Iniciar sesión
              </Link>
              <Link className="btn btn-secundario" to="/registro">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="home-caracteristicas">
        <article className="tarjeta">
          <h3>🚗 Vehículos</h3>
          <p>Registrá la flota completa con marca, modelo, patente, año y capacidad de carga.</p>
        </article>
        <article className="tarjeta">
          <h3>👨‍✈️ Conductores</h3>
          <p>Administrá los datos personales y la licencia de cada conductor de la empresa.</p>
        </article>
        <article className="tarjeta">
          <h3>🗺️ Viajes</h3>
          <p>Asociá cada viaje a un vehículo y un conductor, con fechas, origen, destino y kilómetros.</p>
        </article>
        <article className="tarjeta">
          <h3>📊 Historial y kilómetros</h3>
          <p>Consultá el historial de viajes y el total de kilómetros por vehículo o conductor.</p>
        </article>
      </section>
    </div>
  );
}
