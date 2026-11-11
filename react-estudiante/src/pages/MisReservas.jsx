import { obtenerMedicoPorId } from '../data/mediturnoData';
import BadgeEstadoCita from '../components/BadgeEstadoCita';
import useCuentaRegresiva from '../hooks/useCuentaRegresiva';

function MisReservas({ usuario, citas }) {
  const misCitas = citas.filter(
    (cita) => cita.estudianteId === usuario.id
  );

  const ahora = new Date();

  const citasFuturas = misCitas
    .filter((cita) => {
      if (cita.estado !== 'programada') return false;

      const fechaHora = new Date(
        `${cita.fecha}T${cita.horaInicio}:00`
      );

      return fechaHora > ahora;
    })
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.horaInicio}:00`);
      const fechaB = new Date(`${b.fecha}T${b.horaInicio}:00`);

      return fechaA - fechaB;
    });

  const proximaCita = citasFuturas[0];

  const fechaHoraProxima = proximaCita
    ? `${proximaCita.fecha}T${proximaCita.horaInicio}:00`
    : null;

  const tiempo = useCuentaRegresiva(fechaHoraProxima);

  const medicoProximaCita = proximaCita
    ? obtenerMedicoPorId(proximaCita.medicoId)
    : null;

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-2">Mis citas</h2>

      <p className="text-muted mb-4">
        Consulta tus citas médicas registradas.
      </p>

      {proximaCita && tiempo && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h4 className="fw-bold text-primary mb-2">
              Tu próxima cita médica
            </h4>

            <p className="mb-3">
              {medicoProximaCita?.nombre || 'Médico no disponible'}
            </p>

            <p className="text-muted mb-3">
              Fecha: {proximaCita.fecha} | Hora: {proximaCita.horaInicio}
            </p>

            <div className="row g-3 text-center">
              <div className="col-3">
                <div className="bg-primary text-white rounded-3 p-3">
                  <h3 className="fw-bold mb-0">{tiempo.dias}</h3>
                  <small>Días</small>
                </div>
              </div>

              <div className="col-3">
                <div className="bg-primary text-white rounded-3 p-3">
                  <h3 className="fw-bold mb-0">{tiempo.horas}</h3>
                  <small>Horas</small>
                </div>
              </div>

              <div className="col-3">
                <div className="bg-primary text-white rounded-3 p-3">
                  <h3 className="fw-bold mb-0">{tiempo.minutos}</h3>
                  <small>Minutos</small>
                </div>
              </div>

              <div className="col-3">
                <div className="bg-primary text-white rounded-3 p-3">
                  <h3 className="fw-bold mb-0">{tiempo.segundos}</h3>
                  <small>Segundos</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {misCitas.length === 0 ? (
        <div className="alert alert-info">
          Todavía no tienes citas registradas.
        </div>
      ) : (
        <div className="row g-3">
          {misCitas.map((cita) => {
            const medico = obtenerMedicoPorId(cita.medicoId);

            return (
              <div className="col-12 col-md-6" key={cita.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="fw-bold">
                        {medico?.nombre || 'Médico no disponible'}
                      </h5>

                      <BadgeEstadoCita estado={cita.estado} />
                    </div>

                    <p>
                      <strong>Especialidad:</strong>{' '}
                      {medico?.especialidad || 'No disponible'}
                    </p>

                    <p>
                      <strong>Fecha:</strong> {cita.fecha}
                    </p>

                    <p>
                      <strong>Horario:</strong>{' '}
                      {cita.horaInicio} - {cita.horaFin}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MisReservas;
