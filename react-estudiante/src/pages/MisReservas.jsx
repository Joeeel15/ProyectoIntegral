import ProximaCita from "../components/ProximaCita";
import TarjetaCita from "../components/TarjetaCita";
import ResumenCitas from "../components/ResumenCitas";
import { useMedicosCitas } from "../hooks/useMedicosCitas";

const ESTADOS_CONFIRMADOS = new Set(["aprobada"]);

function MisReservas({
  usuario,
  citas,
  cargando,
  error,
  actualizar,
  onCancelarCita
}) {
  const { medicos, cargando: cargandoMedicos, error: errorMedicos, reintentar } = useMedicosCitas();
  const misCitas = citas.filter(
    (cita) => cita.estudianteId === usuario.id
  );

  const ahora = new Date();

  const citasFuturas = misCitas
    .filter(
      (cita) =>
        ESTADOS_CONFIRMADOS.has(cita.estado) &&
        new Date(`${cita.fecha}T${cita.horaInicio}:00`) > ahora
    )
    .sort(
      (a, b) =>
        new Date(`${a.fecha}T${a.horaInicio}:00`) -
        new Date(`${b.fecha}T${b.horaInicio}:00`)
    );

  const proximaCita = citasFuturas[0];

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <h2 className="fw-bold mb-0">Mis citas</h2>

        <button
          className="btn btn-outline-primary"
          onClick={actualizar}
          disabled={cargando}
        >
          {cargando ? "Actualizando..." : "Actualizar citas"}
        </button>
      </div>

      <p className="text-muted mb-4">
        Consulta tus solicitudes y el estado de tus citas médicas.
      </p>
      <ResumenCitas usuarioId={usuario.id} />
      {cargandoMedicos && <p role="status" className="text-muted">Cargando médicos de la API...</p>}
      {errorMedicos && (
        <div className="alert alert-warning" role="alert">
          {errorMedicos}
          <button type="button" className="btn btn-outline-warning btn-sm ms-2"
            onClick={reintentar}>Reintentar</button>
        </div>
      )}

      {cargando && (
        <div className="alert alert-info">
          Cargando tus citas médicas...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          {proximaCita && (
            <ProximaCita cita={proximaCita} medicos={medicos} />
          )}

          {misCitas.length === 0 ? (
            <div className="alert alert-info">
              Todavía no tienes citas registradas.
            </div>
          ) : (
            <div className="row g-3">
              {misCitas.map((cita) => (
                <TarjetaCita
                  key={cita.id}
                  cita={cita}
                  medicos={medicos}
                  onCancelarCita={onCancelarCita}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default MisReservas;
