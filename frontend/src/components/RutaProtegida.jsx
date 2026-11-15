/**
 * Utilidades de navegación y ruta protegida (autorización en el frontend).
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';

export function RutaProtegida() {
  const { autenticado } = useAuth();
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navbar />
      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
