import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const CLAVE_SESION = 'mediturno.estudiante';

// La sesión simulada guarda datos públicos del estudiante, nunca su contraseña.
function datosDeSesion(usuario) {
  const { id, nombre, correo, codigo, rol, sede } = usuario;
  return { id, nombre, correo, codigo, rol, sede };
}

function restaurarSesion() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_SESION));
    return datos?.id && datos?.rol === 'estudiante' ? datosDeSesion(datos) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(restaurarSesion);

  const iniciarSesion = (usuarioIngresado) => {
    const datos = datosDeSesion(usuarioIngresado);
    setUsuario(datos);
    try { localStorage.setItem(CLAVE_SESION, JSON.stringify(datos)); } catch { /* Sin almacenamiento */ }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    try { localStorage.removeItem(CLAVE_SESION); } catch { /* Sin almacenamiento */ }
  };

  return (
    <AuthContext.Provider value={{
      usuario, iniciarSesion, cerrarSesion, autenticado: usuario !== null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return contexto;
}
