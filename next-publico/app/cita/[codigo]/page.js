import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerCitas, obtenerMedicoPorId } from '../../../lib/api';

export async function generateMetadata({ params }) {
  const { codigo } = await params;

  return {
    title: `Consulta de cita ${codigo} | MediTurno`,
    description: 'Consulta públicamente el estado de tu cita médica en MediTurno.'
  };
}

function obtenerEstado(estado) {
  const estados = {
    pendiente: 'Pendiente de aprobación',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    atendida: 'Atendida',
    cancelada: 'Cancelada',
    no_asistio: 'No asistió'
  };

  return estados[estado] || estado;
}

function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export default async function ConsultarCita({ params }) {
  const { codigo } = await params;

  let citas;

  try {
    citas = await obtenerCitas();
  } catch (error) {
    console.error('Error al consultar las citas:', error);

    return (
      <main className="consulta-pagina">
        <div className="consulta-tarjeta">
          <h1>No se pudo realizar la consulta</h1>
          <p>El servidor no está disponible. Inténtalo nuevamente.</p>
          <Link href="/consultar-cita" className="boton-consulta">
            Volver a consultar
          </Link>
        </div>
      </main>
    );
  }

  const cita = citas.find(
    (item) => String(item.id).toLowerCase() === String(codigo).toLowerCase()
  );

  if (!cita) {
    notFound();
  }

  let medico = null;

  try {
    medico = await obtenerMedicoPorId(cita.medicoId);
  } catch (error) {
    console.error('No se pudo obtener el médico:', error);
  }

  return (
    <main className="consulta-pagina">
      <div className="consulta-tarjeta">
        <Link href="/" className="volver">
          ← Volver al inicio
        </Link>

        <span className="etiqueta-consulta">CONSULTA PÚBLICA</span>

        <h1>Estado de tu cita</h1>

        <p className="codigo-cita">
          Código: <strong>{cita.id}</strong>
        </p>

        <div className="estado-consulta">
          <span>Estado actual</span>
          <strong className={`estado estado-${cita.estado}`}>
            {obtenerEstado(cita.estado)}
          </strong>
        </div>

        <div className="datos-consulta">
          <div>
            <span>Médico</span>
            <strong>{medico?.nombre || 'No disponible'}</strong>
          </div>

          <div>
            <span>Especialidad</span>
            <strong>{medico?.especialidad || 'No disponible'}</strong>
          </div>

          <div>
            <span>Fecha</span>
            <strong>{formatearFecha(cita.fecha)}</strong>
          </div>

          <div>
            <span>Horario</span>
            <strong>{cita.horaInicio} - {cita.horaFin}</strong>
          </div>

          <div>
            <span>Sede</span>
            <strong>{medico?.sede || 'No disponible'}</strong>
          </div>

          <div>
            <span>Consultorio</span>
            <strong>{medico?.consultorio || 'No disponible'}</strong>
          </div>
        </div>

        <p className="aviso-privacidad">
          Esta consulta es pública. Por seguridad, no se muestran datos
          personales del estudiante.
        </p>
      </div>
    </main>
  );
}
