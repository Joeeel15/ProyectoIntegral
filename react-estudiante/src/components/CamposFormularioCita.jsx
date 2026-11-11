function CamposFormularioCita({
  medicos,
  formulario,
  errores,
  manejarCambio,
  campoMedico
}) {
  return (
    <>
      {/* MÉDICO */}
      <div className="mb-3">
        <label className="form-label">Médico</label>

        <select
          ref={campoMedico}
          name="medicoId"
          className={`form-select ${
            errores.medicoId ? "is-invalid" : ""
          }`}
          value={formulario.medicoId}
          onChange={manejarCambio}
        >
          <option value="">Seleccione un médico</option>

          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nombre} - {medico.especialidad}
            </option>
          ))}
        </select>

        {errores.medicoId && (
          <div className="invalid-feedback">
            {errores.medicoId}
          </div>
        )}
      </div>

      {/* FECHA */}
      <div className="mb-3">
        <label className="form-label">Fecha de la cita</label>

        <input
          type="date"
          name="fecha"
          className={`form-control ${
            errores.fecha ? "is-invalid" : ""
          }`}
          value={formulario.fecha}
          onChange={manejarCambio}
        />

        {errores.fecha && (
          <div className="invalid-feedback">
            {errores.fecha}
          </div>
        )}
      </div>

      {/* HORARIOS */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Hora de inicio</label>

          <input
            type="time"
            name="horaInicio"
            className={`form-control ${
              errores.horaInicio ? "is-invalid" : ""
            }`}
            value={formulario.horaInicio}
            onChange={manejarCambio}
          />

          {errores.horaInicio && (
            <div className="invalid-feedback">
              {errores.horaInicio}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Hora de fin</label>

          <input
            type="time"
            name="horaFin"
            className={`form-control ${
              errores.horaFin ? "is-invalid" : ""
            }`}
            value={formulario.horaFin}
            onChange={manejarCambio}
          />

          {errores.horaFin && (
            <div className="invalid-feedback">
              {errores.horaFin}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CamposFormularioCita;
