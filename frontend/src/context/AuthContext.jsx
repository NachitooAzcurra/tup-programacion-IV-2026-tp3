import { createContext, useContext, useState } from 'react';
import { setSession, clearSession, getUsuario } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(getUsuario());

  function login(nuevoToken, nuevoUsuario) {
    setSession(nuevoToken, nuevoUsuario);
    setUsuario(nuevoUsuario);
  }

  function logout() {
    clearSession();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, autenticado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
