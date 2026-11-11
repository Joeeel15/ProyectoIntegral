function BadgeEstadoCita({ estado }) {
  const estilos = {
    programada: 'bg-primary',
    atendida: 'bg-success',
    cancelada: 'bg-danger'
  };

  const etiquetas = {
    programada: 'Programada',
    atendida: 'Atendida',
    cancelada: 'Cancelada'
  };

  return (
    <span className={`badge ${estilos[estado] || 'bg-secondary'}`}>
      {etiquetas[estado] || estado}
    </span>
  );
}

export default BadgeEstadoCita;
