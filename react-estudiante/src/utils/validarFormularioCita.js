import { esHora, esFecha } from "./validaciones.js";
import { existeCruceCita } from "./reglasCitas.js";
import { Cita } from "../../../core-js/modelos.js";

const DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

function diaDeSemana(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return DIAS[new Date(Date.UTC(anio, mes - 1, dia, 12)).getUTCDay()];
}

export function validarFormularioCita(formulario, medicos = [], citas = []) {
  const errores = {};
  const medico = medicos.find((item) => item.id === formulario.medicoId);

  if (!formulario.medicoId) {
    errores.medicoId = "Debes seleccionar un médico.";
  } else if (!medico || medico.estado !== "activo") {
    errores.medicoId = "El médico seleccionado no está disponible.";
  }

  if (!formulario.fecha) {
    errores.fecha = "Debes seleccionar una fecha.";
  } else if (!esFecha(formulario.fecha)) {
    errores.fecha = "La fecha ingresada no es válida.";
  } else {
    const [anio, mes, dia] = formulario.fecha.split("-").map(Number);
    const fechaSeleccionada = new Date(anio, mes - 1, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      errores.fecha = "No puedes solicitar citas en fechas pasadas.";
    } else if (medico && !medico.diasDisponibles.includes(diaDeSemana(formulario.fecha))) {
      errores.fecha = "El médico no atiende el día seleccionado.";
    }
  }

  if (!formulario.horaInicio) {
    errores.horaInicio = "Debes ingresar la hora de inicio.";
  } else if (!esHora(formulario.horaInicio)) {
    errores.horaInicio = "La hora de inicio no es válida.";
  }

  if (!formulario.horaFin) {
    errores.horaFin = "Debes ingresar la hora de fin.";
  } else if (!esHora(formulario.horaFin)) {
    errores.horaFin = "La hora de fin no es válida.";
  }

  if (esHora(formulario.horaInicio) && esHora(formulario.horaFin)) {
    if (formulario.horaInicio >= formulario.horaFin) {
      errores.horaFin = "La hora de fin debe ser posterior a la hora de inicio.";
    }

    if (medico && medico.estado === "activo") {
      const { horaInicio, horaFin } = medico.horarioAtencion;
      if (formulario.horaInicio < horaInicio) {
        errores.horaInicio = `La atención comienza a las ${horaInicio}.`;
      }
      if (formulario.horaFin > horaFin) {
        errores.horaFin = `La atención termina a las ${horaFin}.`;
      }
    }
  }

  // Comprobar disponibilidad solo cuando los demás datos sean válidos.
  if (Object.keys(errores).length === 0) {
    const nuevaCita = new Cita(
      "CIT-TEMP", formulario.medicoId, "EST-TEMP", formulario.fecha,
      formulario.horaInicio, formulario.horaFin, "pendiente",
    );
    if (existeCruceCita(nuevaCita, citas)) {
      errores.horaInicio = "El médico ya tiene una cita en este horario.";
    }
  }

  return errores;
}
