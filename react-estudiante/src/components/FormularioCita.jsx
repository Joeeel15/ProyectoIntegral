import { useEffect, useRef, useState } from "react";

import CamposFormularioCita from "./CamposFormularioCita";
import { validarFormularioCita } from "../utils/validarFormularioCita";

function FormularioCita({ medicos = [], citas = [], onGuardar }) {
  const campoMedico = useRef(null);

  const [formulario, setFormulario] = useState({
    medicoId: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    campoMedico.current?.focus();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setErrores({});
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormularioCita(formulario, medicos, citas);

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const guardado = onGuardar(formulario);

    // Conservar los datos si la cita no se guardó.
    if (guardado !== true) {
      return;
    }

    setFormulario({
      medicoId: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
    });

    setErrores({});
    campoMedico.current?.focus();
  };

  return (
    <form
      onSubmit={manejarEnvio}
      className="card shadow-sm p-4"
      noValidate
    >
      <h4 className="mb-4">Solicitar una cita médica</h4>

      <CamposFormularioCita
        medicos={medicos}
        formulario={formulario}
        errores={errores}
        manejarCambio={manejarCambio}
        campoMedico={campoMedico}
      />

      <button type="submit" className="btn btn-primary w-100">
        Solicitar cita
      </button>
    </form>
  );
}

export default FormularioCita;
