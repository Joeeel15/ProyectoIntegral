import { useState } from 'react';
import { medicos } from '../data/mediturnoData';
import ListaMedicos from '../components/ListaMedicos';

function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [sede, setSede] = useState('');

  const medicosFiltrados = medicos.filter((medico) => {
    const coincideTexto =
      medico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      medico.especialidad.toLowerCase().includes(busqueda.toLowerCase());

    const coincideSede = sede === '' || medico.sede === sede;

    return medico.estado === 'activo' && coincideTexto && coincideSede;
  });

  const sedes = [...new Set(medicos.map((medico) => medico.sede))];

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-2">Catálogo de médicos</h2>
      <p className="text-muted mb-4">
        Encuentra un profesional según su nombre, especialidad o sede.
      </p>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar médico o especialidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={sede}
            onChange={(e) => setSede(e.target.value)}
          >
            <option value="">Todas las sedes</option>
            {sedes.map((nombreSede) => (
              <option key={nombreSede} value={nombreSede}>
                {nombreSede}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ListaMedicos medicos={medicosFiltrados} />
    </main>
  );
}

export default Catalogo;
