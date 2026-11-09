
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("api-mock/db.json");

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const aMinutos = (hora) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

const esHoraValida = (hora) =>
  typeof hora === "string" &&
  /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);

const esFechaValida = (fecha) => {
  if (typeof fecha !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const d = new Date(Date.UTC(anio, mes - 1, dia));

  return d.getUTCFullYear() === anio &&
    d.getUTCMonth() === mes - 1 &&
    d.getUTCDate() === dia;
};

const obtenerDia = (fecha) => {
  const dias = [
    "domingo", "lunes", "martes",
    "miercoles", "jueves", "viernes", "sabado"
  ];

  return dias[new Date(`${fecha}T12:00:00Z`).getUTCDay()];
};

// ==========================================
// VALIDACIONES DE CITAS
// ==========================================

server.use((req, res, next) => {
  const esCreacion =
    req.method === "POST" && req.path === "/citas";

  const esEdicion =
    ["PUT", "PATCH"].includes(req.method) &&
    /^\/citas\/[^/]+$/.test(req.path);

  if (!esCreacion && !esEdicion) return next();

  const db = router.db;
  const citas = db.get("citas").value();

  const idActual = esEdicion
    ? decodeURIComponent(req.path.split("/").pop())
    : null;

  const citaActual = esEdicion
    ? citas.find(c => String(c.id) === idActual)
    : null;

  if (esEdicion && !citaActual) {
    return res.status(404).json({
      error: "La cita no existe."
    });
  }

  const datos = {
    ...(citaActual || {}),
    ...req.body
  };

  const {
    medicoId,
    estudianteId,
    fecha,
    horaInicio,
    horaFin,
    estado = "programada"
  } = datos;

  // 1. Validar campos
  if (!medicoId || !estudianteId ||
      !fecha || !horaInicio || !horaFin) {
    return res.status(400).json({
      error: "Faltan datos obligatorios."
    });
  }

  // 2. Validar estado
  const estadosValidos = [
    "programada", "atendida",
    "cancelada", "no_asistio"
  ];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      error: "Estado de cita no válido."
    });
  }

  // 3. Validar estudiante
  const estudiante = db.get("usuarios")
    .find({ id: estudianteId }).value();

  if (!estudiante || estudiante.rol !== "estudiante") {
    return res.status(400).json({
      error: "El estudiante no existe o no es válido."
    });
  }

  // 4. Validar médico
  const medico = db.get("medicos")
    .find({ id: medicoId }).value();

  if (!medico) {
    return res.status(400).json({
      error: "El médico no existe."
    });
  }

  // 5. Validar fecha y horas
  if (!esFechaValida(fecha) ||
      !esHoraValida(horaInicio) ||
      !esHoraValida(horaFin)) {
    return res.status(400).json({
      error: "Fecha u horario inválido."
    });
  }

  if (aMinutos(horaInicio) >= aMinutos(horaFin)) {
    return res.status(400).json({
      error: "La hora de inicio debe ser menor a la de fin."
    });
  }

  // 6. Validar disponibilidad del médico
  if (estado === "programada") {
    if (medico.estado !== "activo") {
      return res.status(400).json({
        error: "El médico está inactivo."
      });
    }

    if (!medico.diasDisponibles.includes(obtenerDia(fecha))) {
      return res.status(400).json({
        error: "El médico no atiende ese día."
      });
    }

    const horario = medico.horarioAtencion;

    if (aMinutos(horaInicio) < aMinutos(horario.horaInicio) ||
        aMinutos(horaFin) > aMinutos(horario.horaFin)) {
      return res.status(400).json({
        error: "La cita está fuera del horario de atención."
      });
    }

    // 7. Verificar cruces
    const existeCruce = citas.some(cita => {
      if (String(cita.id) === idActual) return false;

      if (cita.estado === "cancelada") return false;

      return cita.medicoId === medicoId &&
        cita.fecha === fecha &&
        aMinutos(horaInicio) < aMinutos(cita.horaFin) &&
        aMinutos(horaFin) > aMinutos(cita.horaInicio);
    });

    if (existeCruce) {
      return res.status(409).json({
        error: "El médico ya tiene una cita en ese horario."
      });
    }
  }

  next();
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

server.use(router);

const PORT = 3001;

server.listen(PORT, () => {
  console.log(
    `MediTurno API: http://localhost:${PORT}`
  );
});
