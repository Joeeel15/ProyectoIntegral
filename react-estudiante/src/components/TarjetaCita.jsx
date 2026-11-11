import { obtenerMedicoPorId } from "../data/mediturnoData";
import BadgeEstadoCita from "./BadgeEstadoCita";
import { puedeCancelarCita } from "../utils/reglasCitas";

function TarjetaCita({ cita, onCancelarCita }) {
  const medico = obtenerMedicoPorId(cita.medicoId);
  return (
    <div className="col-12 col-md-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 gap-2">
            <h5 className="fw-bold">
              {medico?.nombre || "Médico no disponible"}
            </h5>
            <BadgeEstadoCita estado={cita.estado} />
          </div>
          <p>
            <strong>Especialidad:</strong>{" "}
            {medico?.especialidad || "No disponible"}
          </p>
          <p>
            <strong>Fecha:</strong> {cita.fecha}
          </p>
          <p>
            <strong>Horario:</strong> {cita.horaInicio} - {cita.horaFin}
          </p>
          {cita.estado === "cancelada" && (
            <div className="alert alert-secondary py-2 small">
              Esta cita fue cancelada. El horario vuelve a estar disponible.
            </div>
          )}
          {puedeCancelarCita(cita) && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onCancelarCita(cita.id)}
            >
              Cancelar cita
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarjetaCita;
