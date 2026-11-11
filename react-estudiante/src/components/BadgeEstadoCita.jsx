const estilos = {
  pendiente: 'bg-warning text-dark',
  aprobada: 'bg-success',
  rechazada: 'bg-danger',
  programada: 'bg-primary',
  atendida: 'bg-info text-dark',
  cancelada: 'bg-secondary',
  no_asistio: 'bg-dark',
};

const etiquetas = {
  pendiente: 'Pendiente de aprobación',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  programada: 'Programada',
  atendida: 'Atendida',
  cancelada: 'Cancelada',
  no_asistio: 'No asistió',
};

function BadgeEstadoCita({ estado }) {
  return (
    <span className={`badge ${estilos[estado] || 'bg-secondary'}`}>
      {etiquetas[estado] || estado}
    </span>
  );
}

export default BadgeEstadoCita;
