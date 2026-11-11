import { Routes, Route, Navigate } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Catalogo from "../pages/Catalogo";
import DetalleMedico from "../pages/DetalleMedico";
import MisReservas from "../pages/MisReservas";
import NuevaReserva from "../pages/NuevaReserva";
import Login from "../pages/Login";
import NoEncontrado from "../pages/NoEncontrado";

function RutasEstudiante({ usuario, autenticado, citas, onGuardar, onLogin, onCancelarCita }) {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/catalogo/:id" element={<DetalleMedico />} />
      <Route
        path="/mis-reservas"
        element={autenticado
          ? <MisReservas usuario={usuario} citas={citas} onCancelarCita={onCancelarCita} />
          : <Navigate to="/login" replace />}
      />
      <Route
        path="/nueva-reserva"
        element={autenticado
          ? <NuevaReserva citas={citas} onGuardar={onGuardar} />
          : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={autenticado
          ? <Navigate to="/" replace />
          : <Login onLogin={onLogin} />}
      />
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}

export default RutasEstudiante;
