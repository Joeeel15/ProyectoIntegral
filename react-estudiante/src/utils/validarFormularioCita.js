import { esHora, esFecha } from "./validaciones";

export function validarFormularioCita(formulario) {
  const nuevosErrores = {};

  // Validar médico
  if (!formulario.medicoId) {
    nuevosErrores.medicoId = "Debes seleccionar un médico.";
  }

  // Validar fecha
  if (!formulario.fecha) {
    nuevosErrores.fecha = "Debes seleccionar una fecha.";
  } else if (!esFecha(formulario.fecha)) {
    nuevosErrores.fecha = "La fecha ingresada no es válida.";
  } else {
    const partes = formulario.fecha.split("-").map(Number);
    const fechaSeleccionada = new Date(
      partes[0],
      partes[1] - 1,
      partes[2]
    );

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      nuevosErrores.fecha =
        "No puedes solicitar citas en fechas pasadas.";
    }
  }

  // Validar hora de inicio
  if (!formulario.horaInicio) {
    nuevosErrores.horaInicio =
      "Debes ingresar la hora de inicio.";
  } else if (!esHora(formulario.horaInicio)) {
    nuevosErrores.horaInicio =
      "La hora de inicio no es válida.";
  }

  // Validar hora de fin
  if (!formulario.horaFin) {
    nuevosErrores.horaFin =
      "Debes ingresar la hora de fin.";
  } else if (!esHora(formulario.horaFin)) {
    nuevosErrores.horaFin =
      "La hora de fin no es válida.";
  }

  // Validar orden de horarios
  if (
    esHora(formulario.horaInicio) &&
    esHora(formulario.horaFin) &&
    formulario.horaInicio >= formulario.horaFin
  ) {
    nuevosErrores.horaFin =
      "La hora de fin debe ser posterior a la hora de inicio.";
  }

  return nuevosErrores;
}
