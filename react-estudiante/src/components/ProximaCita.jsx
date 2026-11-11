import { obtenerMedicoPorId } from '../data/mediturnoData';
import useCuentaRegresiva from '../hooks/useCuentaRegresiva';

function ProximaCita({ cita }) {
  const fechaHora = `${cita.fecha}T${cita.horaInicio}:00`;
  const tiempo = useCuentaRegresiva(fechaHora);
  const medico = obtenerMedicoPorId(cita.medicoId);
  if (!tiempo) return null;

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold text-primary mb-2">Tu próxima cita médica</h4>
        <p className="mb-3">{medico?.nombre || 'Médico no disponible'}</p>
        <p className="text-muted mb-3">Fecha: {cita.fecha} | Hora: {cita.horaInicio}</p>
        <div className="row g-3 text-center">
          {[
            ['Días', tiempo.dias],
            ['Horas', tiempo.horas],
            ['Minutos', tiempo.minutos],
            ['Segundos', tiempo.segundos],
          ].map(([etiqueta, valor]) => (
            <div className="col-3" key={etiqueta}>
              <div className="bg-primary text-white rounded-3 p-3">
                <h3 className="fw-bold mb-0">{valor}</h3>
                <small>{etiqueta}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProximaCita;
