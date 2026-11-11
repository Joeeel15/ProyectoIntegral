import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <main className="container py-5">
      <section className="bg-primary text-white rounded-4 p-5 mb-5">
        <h1 className="display-5 fw-bold">
          Bienvenido a MediTurno
        </h1>
        <p className="lead">
          Encuentra médicos, consulta sus especialidades y
          solicita tus citas médicas de manera sencilla.
        </p>
        <Link to="/catalogo" className="btn btn-light btn-lg mt-3">
          Explorar médicos
        </Link>
      </section>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Consulta el catálogo</h5>
              <p className="text-muted">
                Revisa los médicos y sus especialidades disponibles.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Solicita una cita</h5>
              <p className="text-muted">
                Selecciona el médico, la fecha y el horario que necesitas.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Organiza tus citas</h5>
              <p className="text-muted">
                Consulta el estado de tus citas desde tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Inicio;
