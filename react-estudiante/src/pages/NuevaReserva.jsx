import { useEffect, useState } from "react";

import FormularioCita from "../components/FormularioCita";
import { obtenerMedicos } from "../services/apiFetch";

function NuevaReserva({
  citas,
  cargando,
  error,
  onGuardar
}) {
  const [medicos, setMedicos] = useState([]);
  const [cargandoMedicos, setCargandoMedicos] = useState(true);
  const [errorMedicos, setErrorMedicos] = useState("");

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarMedicos() {
      setCargandoMedicos(true);
      setErrorMedicos("");

      try {
        const resultado = await obtenerMedicos({
          signal: controlador.signal
        });

        setMedicos(
          resultado.filter((medico) => medico.estado === "activo")
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorMedicos(err.message || "No se pudieron cargar los médicos.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoMedicos(false);
        }
      }
    }

    cargarMedicos();

    return () => controlador.abort();
  }, []);

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-2">Nueva cita médica</h2>

          <p className="text-muted mb-4">
            Completa los datos para solicitar una cita.
          </p>

          {cargandoMedicos && (
            <div className="alert alert-info">
              Cargando catálogo de médicos...
            </div>
          )}

          {errorMedicos && (
            <div className="alert alert-danger" role="alert">
              {errorMedicos}
            </div>
          )}

          {!cargandoMedicos && !errorMedicos && medicos.length === 0 && (
            <div className="alert alert-warning">
              No hay médicos disponibles en este momento.
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!cargandoMedicos && !errorMedicos && medicos.length > 0 && (
            <FormularioCita
              medicos={medicos}
              citas={citas}
              onGuardar={onGuardar}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default NuevaReserva;
