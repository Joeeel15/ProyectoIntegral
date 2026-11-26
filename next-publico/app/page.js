import Link from "next/link";
import { obtenerMedicos } from "../lib/api";
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Médicos | MediTurno",
  description:
    "Consulta los médicos, especialidades y horarios disponibles de MediTurno.",
};

export default async function Inicio() {
  let medicos = [];
  let error = false;

  try {
    medicos = await obtenerMedicos();
  } catch {
    error = true;
  }

  return (
    <main className="catalogo">
      <section className="hero">
        <span className="etiqueta">MEDITURNO · PORTAL PÚBLICO</span>

        <h1>Encuentra a tu médico</h1>

        <p>
          Consulta nuestros profesionales, conoce sus especialidades y revisa
          sus horarios de atención.
        </p>

        <div className="acciones-hero">
          <a href="#medicos" className="boton-hero">
            Explorar médicos
          </a>

          <Link href="/consultar-cita" className="boton-hero boton-secundario">
            Consultar mi cita
          </Link>
        </div>
      </section>

      <section className="contenido" id="medicos">
        <div className="encabezado-seccion">
          <div>
            <h2>Nuestros médicos</h2>
            <p>Profesionales disponibles en nuestras sedes.</p>
          </div>

          <span className="contador">{medicos.length} médicos</span>
        </div>

        {error ? (
          <div className="mensaje">
            No se pudo conectar con el servidor. Inténtalo nuevamente.
          </div>
        ) : medicos.length === 0 ? (
          <div className="mensaje">Actualmente no hay médicos registrados.</div>
        ) : (
          <div className="grid-medicos">
            {medicos.map((medico) => (
              <article className="tarjeta-medico" key={medico.id}>
                <div className="icono-medico">+</div>

                <div className="informacion-medico">
                  <span className="especialidad">{medico.especialidad}</span>

                  <h3>{medico.nombre}</h3>

                  <p>
                    <strong>Sede:</strong> {medico.sede}
                  </p>

                  <p>
                    <strong>Consultorio:</strong> {medico.consultorio}
                  </p>

                  <p>
                    <strong>Días:</strong>{" "}
                    {Array.isArray(medico.diasDisponibles)
                      ? medico.diasDisponibles.join(", ")
                      : medico.diasDisponibles}
                  </p>

                  <p>
                    <strong>Horario:</strong>{" "}
                    {medico.horarioAtencion?.horaInicio &&
                    medico.horarioAtencion?.horaFin
                      ? `${medico.horarioAtencion.horaInicio} - ${medico.horarioAtencion.horaFin}`
                      : "Horario no especificado"}
                  </p>

                  <span
                    className={
                      medico.estado === "activo"
                        ? "estado activo"
                        : "estado inactivo"
                    }
                  >
                    {medico.estado === "activo"
                      ? "Disponible"
                      : "No disponible"}
                  </span>
                </div>

                <Link
                  href={`/medicos/${encodeURIComponent(medico.id)}`}
                  className="boton-detalle"
                >
                  Ver detalles
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
