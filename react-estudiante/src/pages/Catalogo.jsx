import { useEffect, useState } from 'react';
import { obtenerMedicos } from '../services/apiFetch';
import ListaMedicos from '../components/ListaMedicos';

function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [sede, setSede] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    obtenerMedicos({ signal: controlador.signal })
      .then((datos) => {
        setMedicos(datos);
        setError('');
      })
      .catch((fallo) => {
        if (fallo.name !== 'AbortError') setError(fallo.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });
    return () => controlador.abort();
  }, [intento]);

  const medicosFiltrados = medicos.filter((medico) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto = medico.nombre.toLowerCase().includes(texto) ||
      medico.especialidad.toLowerCase().includes(texto);
    return medico.estado === 'activo' && coincideTexto &&
      (sede === '' || medico.sede === sede);
  });
  const sedes = [...new Set(medicos.map((medico) => medico.sede))];

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-2">Catálogo de médicos</h2>
      <p className="text-muted mb-4">
        Consulta los médicos registrados en la API de MediTurno.
      </p>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input type="search" className="form-control"
            placeholder="Buscar médico o especialidad..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={sede}
            onChange={(e) => setSede(e.target.value)}>
            <option value="">Todas las sedes</option>
            {sedes.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="alert alert-info" role="status">Cargando médicos desde la API...</div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => { setCargando(true); setIntento((n) => n + 1); }}>
            Reintentar
          </button>
        </div>
      ) : (
        <ListaMedicos medicos={medicosFiltrados} />
      )}
    </main>
  );
}

export default Catalogo;
