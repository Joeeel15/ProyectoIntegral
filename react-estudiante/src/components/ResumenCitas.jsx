import { useRequest } from "alova/client";
import { apiAlova } from "../services/apiAlova";

const ESTADOS = [
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "aprobada", etiqueta: "Aprobadas" },
  { valor: "rechazada", etiqueta: "Rechazadas" },
  { valor: "atendida", etiqueta: "Atendidas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
  { valor: "no_asistio", etiqueta: "No asistió" }
];

function ResumenCitas({ usuarioId }) {
  const {
    data: citas,
    loading,
    error,
    send
  } = useRequest(
    () =>
      apiAlova.Get("/citas", {
        params: { estudianteId: usuarioId },
        cacheFor: 30 * 1000
      }),
    {
      initialData: [],
      force: ({ args }) => args[0] === true
    }
  );

  const totalPorEstado = (estado) =>
    citas.filter(
      (cita) => cita.estado?.toLowerCase() === estado
    ).length;

  return (
    <section className="card shadow-sm p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="fw-bold mb-0">Resumen de mis citas</h5>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => send(true)}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar resumen"}
        </button>
      </div>

      {loading && (
        <p className="text-muted mb-2">
          Consultando resumen de citas...
        </p>
      )}

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          No se pudo cargar el resumen de citas.
        </div>
      )}

      <div className="row g-3">
        {ESTADOS.map((estado) => (
          <div className="col-6 col-md-4 col-lg-2" key={estado.valor}>
            <div className="border rounded p-3 text-center h-100">
              <div className="fs-3 fw-bold">
                {totalPorEstado(estado.valor)}
              </div>

              <small className="text-muted">
                {estado.etiqueta}
              </small>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && citas.length === 0 && (
        <p className="text-muted mt-3 mb-0">
          No hay citas registradas para generar el resumen.
        </p>
      )}
    </section>
  );
}

export default ResumenCitas;
