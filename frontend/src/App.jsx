import { Routes, Route } from 'react-router-dom';
import { RutaProtegida } from './components/RutaProtegida.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Vehiculos from './pages/Vehiculos.jsx';
import Conductores from './pages/Conductores.jsx';
import Viajes from './pages/Viajes.jsx';
import Historial from './pages/Historial.jsx';

export default function App() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Páginas protegidas: solo usuarios autenticados con JWT */}
      <Route element={<RutaProtegida />}>
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/conductores" element={<Conductores />} />
        <Route path="/viajes" element={<Viajes />} />
        <Route path="/historial" element={<Historial />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
