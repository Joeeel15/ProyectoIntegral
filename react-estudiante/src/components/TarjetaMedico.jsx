import { Link } from 'react-router-dom';

function TarjetaMedico({ medico }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-success">
            {medico.estado}
          </span>
          <span className="text-muted small">
            {medico.sede}
          </span>
        </div>

        <h5 className="card-title fw-bold">
          {medico.nombre}
        </h5>

        <p className="text-primary mb-2">
          {medico.especialidad}
        </p>

        <p className="text-muted mb-1">
          <strong>Consultorio:</strong> {medico.consultorio}
        </p>

        <p className="text-muted small">
          <strong>Días:</strong>{' '}
          {medico.diasDisponibles?.join(', ')}
        </p>

        <Link
          to={`/catalogo/${medico.id}`}
          className="btn btn-primary w-100 mt-2"
        >
          Ver información
        </Link>
      </div>
    </div>
  );
}

export default TarjetaMedico;
