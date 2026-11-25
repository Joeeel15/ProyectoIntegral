import { useState, useEffect, useCallback } from "react";

import {
  listarCitas,
  crearCita,
  cancelarCita,
  marcarCitaAtendida,
} from "../services/citasAxios.js";

export function useReservas(usuarioId) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consultar las citas del estudiante.
  const actualizar = useCallback(async () => {
    if (!usuarioId) {
      setDatos([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const citas = await listarCitas(usuarioId);
      setDatos(citas);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las citas.");
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  // Carga inicial y actualización automática cada 15 segundos.
  useEffect(() => {
    actualizar();

    const intervalo = setInterval(() => {
      actualizar();
    }, 15000);

    return () => {
      clearInterval(intervalo);
    };
  }, [actualizar]);

  // Crear una nueva cita.
  const crear = async (formulario) => {
    setError("");

    try {
      const nuevaCita = await crearCita(formulario, usuarioId);

      setDatos((actuales) => [...actuales, nuevaCita]);

      return nuevaCita;
    } catch (err) {
      setError(err.message || "No se pudo crear la cita.");
      throw err;
    }
  };

  // Cancelar una cita existente.
  const cancelar = async (citaId) => {
    setError("");

    try {
      const citaCancelada = await cancelarCita(citaId);

      setDatos((actuales) =>
        actuales.map((cita) => (cita.id === citaId ? citaCancelada : cita)),
      );

      return citaCancelada;
    } catch (err) {
      setError(err.message || "No se pudo cancelar la cita.");
      throw err;
    }
  };

  // Confirmación por el estudiante. El servidor verifica la ventana de 24 horas.
  const marcarAtendida = async (citaId) => {
    setError("");
    try {
      const actualizada = await marcarCitaAtendida(citaId);
      setDatos((actuales) =>
        actuales.map((cita) => (cita.id === citaId ? actualizada : cita)),
      );
      return actualizada;
    } catch (err) {
      setError(err.message || "No se pudo registrar la asistencia.");
      throw err;
    }
  };

  return {
    datos,
    cargando,
    error,
    crear,
    cancelar,
    marcarAtendida,
    actualizar,
  };
}
