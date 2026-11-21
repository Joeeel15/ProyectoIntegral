import { useEffect } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import RutasEstudiante from "./components/RutasEstudiante";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useReservas } from "./hooks/useReservas";

function Aplicacion() {
  const { usuario, iniciarSesion, cerrarSesion, autenticado } = useAuth();

  const {
    datos: citas,
    cargando,
    error,
    crear,
    cancelar,
    actualizar
  } = useReservas(usuario?.id);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const titulos = {
      "/": "Inicio",
      "/catalogo": "Catálogo de médicos",
      "/mis-reservas": "Mis citas",
      "/nueva-reserva": "Nueva cita",
      "/login": "Iniciar sesión",
    };

    const tituloActual = titulos[location.pathname] ||
      (location.pathname.startsWith("/catalogo/")
        ? "Información del médico" : "Página no encontrada");

    document.title = `${tituloActual} | MediTurno`;
  }, [location.pathname]);

  const manejarLogin = (usuarioIngresado) => {
    iniciarSesion(usuarioIngresado);
    navigate("/");
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate("/");
  };

  const manejarNuevaCita = async (datos) => {
    if (!usuario) return false;

    try {
      await crear(datos);
      alert("Solicitud registrada: tu cita está pendiente de aprobación.");
      navigate("/mis-reservas");
      return true;
    } catch {
      return false;
    }
  };

  const manejarCancelarCita = async (citaId) => {
    const seleccionada = citas.find((cita) => cita.id === citaId);

    if (
      !usuario ||
      !seleccionada ||
      seleccionada.estudianteId !== usuario.id
    ) {
      return;
    }

    if (!window.confirm("¿Deseas cancelar esta cita médica?")) return;

    try {
      await cancelar(citaId);
    } catch {
      // El mensaje de error se muestra desde el hook.
    }
  };

  return (
    <>
      <Navbar usuario={usuario} onCerrarSesion={manejarCerrarSesion} />

      <RutasEstudiante
        usuario={usuario}
        autenticado={autenticado}
        citas={citas}
        cargando={cargando}
        error={error}
        actualizar={actualizar}
        onGuardar={manejarNuevaCita}
        onLogin={manejarLogin}
        onCancelarCita={manejarCancelarCita}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Aplicacion />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
