import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import DetalleMedico from "./pages/DetalleMedico";
import MisReservas from "./pages/MisReservas";
import NuevaReserva from "./pages/NuevaReserva";
import Login from "./pages/Login";
import NoEncontrado from "./pages/NoEncontrado";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import { citasIniciales, Cita } from "./data/mediturnoData";

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

    const tituloActual =
      titulos[location.pathname] ||
      (location.pathname.startsWith("/catalogo/")
        ? "Información del médico"
        : "Página no encontrada");

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
      `CIT-${Date.now()}`,
      datos.medicoId,
      usuario.id,
      datos.fecha,
      datos.horaInicio,
      datos.horaFin,
      "programada",
    );

    const existeCruce = citas.some((citaExistente) => {
      if (citaExistente.estado === "cancelada") return false;
      return nuevaCita.seCruzaCon(citaExistente);
    });

    if (existeCruce) {
      alert("El médico ya tiene una cita en ese horario.");
      return false;
    }

    setCitas((anteriores) => [...anteriores, nuevaCita]);

    alert("La cita se registró correctamente.");
    navigate("/mis-reservas");

    return true;
  };

  return (
    <>
      <Navbar usuario={usuario} onCerrarSesion={manejarCerrarSesion} />

      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route path="/catalogo" element={<Catalogo />} />

        <Route path="/catalogo/:id" element={<DetalleMedico />} />

        <Route
          path="/mis-reservas"
          element={
            autenticado ? (
              <MisReservas usuario={usuario} citas={citas} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/nueva-reserva"
          element={
            autenticado ? (
              <NuevaReserva onGuardar={manejarNuevaCita} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            autenticado ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={manejarLogin} />
            )
          }
        />

        <Route path="*" element={<NoEncontrado />} />
      </Routes>
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
