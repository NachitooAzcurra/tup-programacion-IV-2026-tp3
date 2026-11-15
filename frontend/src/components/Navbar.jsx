import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function salir() {
    logout();
    navigate('/login');
  }

  const clase = ({ isActive }) => (isActive ? 'nav-enlace activo' : 'nav-enlace');

  return (
    <nav className="navbar">
      <span className="navbar-logo">Control de Vehículos</span>
      <div className="nav-enlaces">
        <NavLink to="/vehiculos" className={clase}>Vehículos</NavLink>
        <NavLink to="/conductores" className={clase}>Conductores</NavLink>
        <NavLink to="/viajes" className={clase}>Viajes</NavLink>
        <NavLink to="/historial" className={clase}>Historial / Km</NavLink>
      </div>
      <div className="nav-usuario">
        <span>Hola, {usuario?.nombre}</span>
        <button className="btn btn-secundario" onClick={salir}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
