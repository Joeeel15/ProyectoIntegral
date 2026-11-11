import { Link } from 'react-router-dom';

function NoEncontrado() {
  return (
    <main className="container text-center py-5">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2>Página no encontrada</h2>
      <p className="text-muted">
        La dirección que buscas no existe en MediTurno.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}

export default NoEncontrado;
