import { useEffect, useState } from "react";
import { obtenerMedicos } from "../services/apiFetch";

// Catálogo actualizado desde la API para las tarjetas del historial.
export function useMedicosCitas() {
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    obtenerMedicos({ signal: controlador.signal })
      .then((datos) => {
        if (!controlador.signal.aborted) setMedicos(datos);
      })
      .catch((fallo) => {
        if (!controlador.signal.aborted && fallo.name !== "AbortError") {
          setError(fallo.message || "No se pudieron cargar los médicos.");
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });
    return () => controlador.abort();
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setError("");
    setIntento((anterior) => anterior + 1);
  };

  return { medicos, cargando, error, reintentar };
}
