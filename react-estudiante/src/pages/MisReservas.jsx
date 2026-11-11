import ProximaCita from "../components/ProximaCita";
import TarjetaCita from "../components/TarjetaCita";

const ESTADOS_CONFIRMADOS = new Set(["aprobada", "programada"]);

function MisReservas({ usuario, citas, onCancelarCita }) {
  const misCitas = citas.filter((cita) => cita.estudianteId === usuario.id);

  const ahora = new Date();
  const citasFuturas = misCitas
    .filter(
      (cita) =>
        ESTADOS_CONFIRMADOS.has(cita.estado) &&
        new Date(`${cita.fecha}T${cita.horaInicio}:00`) > ahora,
    )
    .sort(
      (a, b) =>
        new Date(`${a.fecha}T${a.horaInicio}:00`) -
        new Date(`${b.fecha}T${b.horaInicio}:00`),
    );
  const proximaCita = citasFuturas[0];

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-2">Mis citas</h2>
      <p className="text-muted mb-4">
        Consulta tus solicitudes y el estado de tus citas médicas.
      </p>
      {proximaCita && <ProximaCita cita={proximaCita} />}
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
              onCancelarCita={onCancelarCita}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default MisReservas;
