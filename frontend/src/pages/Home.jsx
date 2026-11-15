import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { autenticado } = useAuth();

  return (
    <div className="home">
      <header className="home-hero">
        <h1>Control de Vehículos</h1>
        <p className="home-subtitulo">
          Trabajo Práctico N.º 3 de Programación IV. Registro de vehículos, conductores y
          viajes de una empresa de transporte, con autenticación de usuarios y totales de
          kilómetros recorridos.
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
          <h3>Vehículos</h3>
          <p>Alta, modificación y baja de la flota: marca, modelo, patente, año y capacidad de carga.</p>
        </article>
        <article className="tarjeta">
          <h3>Conductores</h3>
          <p>Datos personales de cada conductor y fechas de alta y vencimiento de su licencia.</p>
        </article>
        <article className="tarjeta">
          <h3>Viajes</h3>
          <p>Cada viaje se registra con un vehículo, un conductor, fechas, origen, destino y kilómetros.</p>
        </article>
        <article className="tarjeta">
          <h3>Historial y kilómetros</h3>
          <p>Consulta de viajes por vehículo o conductor, con el total de kilómetros de cada uno.</p>
        </article>
      </section>
    </div>
  );
}
