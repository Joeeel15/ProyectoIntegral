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
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

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
    setMensajeError("");
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormularioCita(
      formulario,
      medicos,
      citas
    );

    setErrores(nuevosErrores);
    setMensajeError("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setGuardando(true);

    try {
      const guardado = await onGuardar(formulario);

      if (guardado !== true) {
        setMensajeError(
          "No se pudo registrar la cita. Revisa los datos e inténtalo nuevamente."
        );
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

    } catch (error) {
      setMensajeError(
        error.message || "Ocurrió un error al registrar la cita."
      );
    } finally {
      setGuardando(false);
    }
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

      {mensajeError && (
        <div className="alert alert-danger mt-3" role="alert">
          {mensajeError}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100 mt-3"
        disabled={guardando}
      >
        {guardando ? "Registrando cita..." : "Solicitar cita"}
      </button>
    </form>
  );
}

export default FormularioCita;
