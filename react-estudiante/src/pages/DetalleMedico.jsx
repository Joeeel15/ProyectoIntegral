import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerMedico } from '../services/apiFetch';

function DetalleMedico() {
  const { id } = useParams();
  const [medico, setMedico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    obtenerMedico(id, { signal: controlador.signal })
      .then((datos) => { setMedico(datos); setError(''); })
      .catch((fallo) => {
        if (fallo.name !== 'AbortError') setError(fallo.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });
    return () => controlador.abort();
  }, [id, intento]);

  if (cargando) return (
    <main className="container py-5" role="status">Cargando médico desde la API...</main>
  );

  if (error) return (
    <main className="container py-5">
      <div className="alert alert-danger" role="alert">{error}</div>
      <button type="button" className="btn btn-outline-primary me-2"
        onClick={() => { setCargando(true); setIntento((n) => n + 1); }}>
        Reintentar
      </button>
      <Link to="/catalogo" className="btn btn-primary">Volver al catálogo</Link>
    </main>
  );

  if (!medico) return (
    <main className="container py-5">
      <div className="alert alert-warning">No se encontró el médico solicitado.</div>
      <Link to="/catalogo" className="btn btn-primary">Volver al catálogo</Link>
    </main>
  );

  return (
    <main className="container py-5">
      <Link to="/catalogo" className="text-decoration-none">← Volver al catálogo</Link>
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <span className={`badge mb-3 ${medico.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
            {medico.estado}
          </span>
          <h2 className="fw-bold">{medico.nombre}</h2>
          <h5 className="text-primary">{medico.especialidad}</h5>
          <hr />
          <p><strong>Consultorio:</strong> {medico.consultorio}</p>
          <p><strong>Sede:</strong> {medico.sede}</p>
          <p><strong>Días disponibles:</strong> {medico.diasDisponibles.join(', ')}</p>
          <p><strong>Horario de atención:</strong>{' '}
            {medico.horarioAtencion.horaInicio} - {medico.horarioAtencion.horaFin}
          </p>
          {medico.estado === 'activo' && (
            <Link to="/nueva-reserva" className="btn btn-primary mt-3">
              Solicitar una cita
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default DetalleMedico;
