import { Link, useParams } from 'react-router-dom';
import { obtenerMedicoPorId } from '../data/mediturnoData';

function DetalleMedico() {
  const { id } = useParams();
  const medico = obtenerMedicoPorId(id);

  if (!medico) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">
          No se encontró el médico solicitado.
        </div>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <Link to="/catalogo" className="text-decoration-none">
        ← Volver al catálogo
      </Link>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <span className="badge bg-success mb-3">
            {medico.estado}
          </span>

          <h2 className="fw-bold">{medico.nombre}</h2>
          <h5 className="text-primary">{medico.especialidad}</h5>

          <hr />

          <p><strong>Consultorio:</strong> {medico.consultorio}</p>
          <p><strong>Sede:</strong> {medico.sede}</p>
          <p>
            <strong>Días disponibles:</strong>{' '}
            {medico.diasDisponibles.join(', ')}
          </p>
          <p>
            <strong>Horario de atención:</strong>{' '}
            {medico.horarioAtencion.horaInicio} - {medico.horarioAtencion.horaFin}
          </p>

          <Link to="/nueva-reserva" className="btn btn-primary mt-3">
            Solicitar una cita
          </Link>
        </div>
      </div>
    </main>
  );
}

export default DetalleMedico;
