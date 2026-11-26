import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="pagina-404">
      <div className="contenido-404">
        <span className="etiqueta-404">MEDITURNO</span>

        <h1>404</h1>

        <h2>¡Ups! Página no encontrada</h2>

        <p>
          No pudimos encontrar la página o la cita que estás buscando.
          Es posible que el código sea incorrecto o que el recurso ya no exista.
        </p>

        <div className="acciones-404">
          <Link href="/" className="boton-404">
            Volver al inicio
          </Link>

          <Link href="/consultar-cita" className="boton-404 secundario-404">
            Consultar otra cita
          </Link>
        </div>
      </div>
    </main>
  );
}
