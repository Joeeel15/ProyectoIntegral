import { useEffect, useState } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import RutasEstudiante from "./components/RutasEstudiante";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { citasIniciales, Cita } from "./data/mediturnoData";
import { cancelarCitaLocal, existeCruceCita, puedeCancelarCita } from "./utils/reglasCitas";

function Aplicacion() {
  const { usuario, iniciarSesion, cerrarSesion, autenticado } = useAuth();
  const [citas, setCitas] = useState(citasIniciales);
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

  const manejarNuevaCita = (datos) => {
    if (!usuario) return false;
    const nuevaCita = new Cita(
      `CIT-${Date.now()}`, datos.medicoId, usuario.id,
      datos.fecha, datos.horaInicio, datos.horaFin, "pendiente",
    );

    // Segunda comprobación: no depende de que el formulario esté bien conectado.
    if (existeCruceCita(nuevaCita, citas)) return false;

    setCitas((anteriores) => [...anteriores, nuevaCita]);
    alert("Solicitud registrada: tu cita está pendiente de aprobación.");
    navigate("/mis-reservas");
    return true;
  };

  const manejarCancelarCita = (citaId) => {
    const seleccionada = citas.find((cita) => cita.id === citaId);
    if (!usuario || !seleccionada || seleccionada.estudianteId !== usuario.id ||
        !puedeCancelarCita(seleccionada)) return;
    if (!window.confirm("¿Deseas cancelar esta cita médica?")) return;
    setCitas((anteriores) => cancelarCitaLocal(anteriores, citaId, usuario.id));
  };

  return (
    <>
      <Navbar usuario={usuario} onCerrarSesion={manejarCerrarSesion} />
      <RutasEstudiante
        usuario={usuario} autenticado={autenticado} citas={citas}
        onGuardar={manejarNuevaCita} onLogin={manejarLogin}
        onCancelarCita={manejarCancelarCita}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter><Aplicacion /></BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
