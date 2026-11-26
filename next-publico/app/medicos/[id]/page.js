import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  obtenerMedicoPorId,
  obtenerCitas
} from '../../../lib/api';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const medico = await obtenerMedicoPorId(id);

  if (!medico) {
    return {
      title: 'Médico no encontrado | MediTurno',
      description: 'No se encontró el médico solicitado.'
    };
  }

  return {
    title: `${medico.nombre} | MediTurno`,
    description: `Consulta la información, especialidad y horarios de ${medico.nombre} en MediTurno.`
  };
}

function obtenerSemanaActual() {
  const hoy = new Date();
  const dia = hoy.getUTCDay();

  const diferenciaLunes = dia === 0 ? -6 : 1 - dia;

  const lunes = new Date(hoy);
  lunes.setUTCDate(hoy.getUTCDate() + diferenciaLunes);

  const domingo = new Date(lunes);
  domingo.setUTCDate(lunes.getUTCDate() + 6);

  return {
    inicio: lunes.toISOString().slice(0, 10),
    fin: domingo.toISOString().slice(0, 10)
  };
}

function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export default async function DetalleMedico({ params }) {
  const { id } = await params;

  const medico = await obtenerMedicoPorId(id);

  if (!medico) {
    notFound();
  }

  let citas = [];

  try {
    citas = await obtenerCitas();
  } catch (error) {
    console.error('No se pudieron cargar las citas:', error);
  }

  const semana = obtenerSemanaActual();

  const citasAprobadas = citas
    .filter((cita) =>
      cita.medicoId === medico.id &&
      cita.estado === 'aprobada' &&
      cita.fecha >= semana.inicio &&
      cita.fecha <= semana.fin
    )
    .sort((a, b) => {
      const fechaA = `${a.fecha}T${a.horaInicio}`;
      const fechaB = `${b.fecha}T${b.horaInicio}`;

      return fechaA.localeCompare(fechaB);
    });

  return (
    <main className="detalle-pagina">
      <section className="detalle-hero">
        <Link href="/" className="volver">
          ← Volver al catálogo
        </Link>

        <span className="etiqueta">PERFIL DEL PROFESIONAL</span>

        <h1>{medico.nombre}</h1>

        <p>{medico.especialidad}</p>
      </section>

      <section className="detalle-contenido">
        <div className="datos-medico">
          <div className="titulo-bloque">
            <h2>Información del médico</h2>
            <span className="estado activo">
              {medico.estado === 'activo' ? 'Disponible' : 'No disponible'}
            </span>
          </div>

          <div className="datos-grid">
            <div className="dato">
              <span>Especialidad</span>
              <strong>{medico.especialidad}</strong>
            </div>

            <div className="dato">
              <span>Sede</span>
              <strong>{medico.sede}</strong>
            </div>

            <div className="dato">
              <span>Consultorio</span>
              <strong>{medico.consultorio}</strong>
            </div>

            <div className="dato">
              <span>Días disponibles</span>
              <strong>
                {Array.isArray(medico.diasDisponibles)
                  ? medico.diasDisponibles.join(', ')
                  : medico.diasDisponibles}
              </strong>
            </div>

            <div className="dato">
              <span>Horario de atención</span>
              <strong>
                {medico.horarioAtencion?.horaInicio || '--:--'}
                {' - '}
                {medico.horarioAtencion?.horaFin || '--:--'}
              </strong>
            </div>
          </div>
        </div>

        <div className="citas-semana">
          <div className="titulo-bloque">
            <div>
              <h2>Citas aprobadas</h2>
              <p>
                Semana del {semana.inicio} al {semana.fin}
              </p>
            </div>

            <span className="contador">
              {citasAprobadas.length} citas
            </span>
          </div>

          {citasAprobadas.length === 0 ? (
            <div className="mensaje">
              No hay citas aprobadas para este médico durante esta semana.
            </div>
          ) : (
            <div className="lista-citas">
              {citasAprobadas.map((cita) => (
                <article className="tarjeta-cita" key={cita.id}>
                  <div>
                    <span className="fecha-cita">
                      {formatearFecha(cita.fecha)}
                    </span>

                    <h3>
                      {cita.horaInicio} - {cita.horaFin}
                    </h3>
                  </div>

                  <span className="estado activo">Aprobada</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
