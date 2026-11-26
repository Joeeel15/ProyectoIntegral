import Link from 'next/link';

export const metadata = {
  title: 'Consultar cita | MediTurno',
  description: 'Ingresa el código de tu cita para consultar su estado.'
};

export default function ConsultarCitaInicio() {
  return (
    <main className="consulta-pagina">
      <div className="consulta-tarjeta">
        <Link href="/" className="volver">
          ← Volver al inicio
        </Link>

        <span className="etiqueta-consulta">MEDITURNO</span>

        <h1>Consulta tu cita médica</h1>

        <p className="texto-consulta">
          Ingresa el código de tu cita para conocer su estado actual.
        </p>

        <form action="/cita" method="GET" className="formulario-consulta">
          <label htmlFor="codigo">Código de cita</label>

          <input
            id="codigo"
            name="codigo"
            type="text"
            placeholder="Ejemplo: CIT-0001"
            required
          />

          <button type="submit">Consultar cita</button>
        </form>

        <p className="aviso-privacidad">
          Puedes realizar esta consulta sin iniciar sesión.
        </p>
      </div>
    </main>
  );
}
