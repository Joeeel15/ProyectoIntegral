import FormularioCita from '../components/FormularioCita';
import { medicos } from '../data/mediturnoData';

function NuevaReserva({ onGuardar }) {
  const medicosActivos = medicos.filter(
    (medico) => medico.estado === 'activo'
  );

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-2">Nueva cita médica</h2>
          <p className="text-muted mb-4">
            Completa los datos para solicitar una cita.
          </p>

          <FormularioCita
            medicos={medicosActivos}
            onGuardar={onGuardar}
          />
        </div>
      </div>
    </main>
  );
}

export default NuevaReserva;
