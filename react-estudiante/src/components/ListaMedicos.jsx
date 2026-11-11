import TarjetaMedico from './TarjetaMedico';

function ListaMedicos({ medicos = [] }) {
  if (medicos.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No se encontraron médicos disponibles.
      </div>
    );
  }

  return (
    <div className="row g-4">
      {medicos.map((medico) => (
        <div className="col-12 col-md-6 col-lg-4" key={medico.id}>
          <TarjetaMedico medico={medico} />
        </div>
      ))}
    </div>
  );
}

export default ListaMedicos;
