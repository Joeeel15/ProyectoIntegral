
const jsonServer = require("json-server");

const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));

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
// VALIDACIONES DEL CATÁLOGO DE MÉDICOS
// ==========================================

server.use((req, res, next) => {
  const crear = req.method === "POST" && req.path === "/medicos";
  const detalle = /^\/medicos\/[^/]+$/.test(req.path);
  const editar = detalle && ["PUT", "PATCH"].includes(req.method);
  const eliminar = detalle && req.method === "DELETE";

  if (!crear && !editar && !eliminar) return next();

  const medicos = router.db.get("medicos").value();
  const idRuta = detalle ? decodeURIComponent(req.path.split("/").pop()) : null;
  const actual = idRuta ? medicos.find(m => m.id === idRuta) : null;

  if ((editar || eliminar) && !actual) {
    return res.status(404).json({ error: "El médico no existe." });
  }

  if (eliminar) {
    // No eliminar historiales de citas al borrar un médico.
    const tieneCitas = router.db.get("citas").value()
      .some(c => c.medicoId === idRuta);

    if (tieneCitas) {
      return res.status(409).json({
        error: "No se puede eliminar este médico porque tiene citas asociadas. Puedes cambiar su estado a inactivo."
      });
    }
    return next();
  }

  const datos = { ...(actual || {}), ...(req.body || {}) };
  const { id, nombre, especialidad, sede, consultorio,
    diasDisponibles, horarioAtencion, estado } = datos;

  if (crear && medicos.some(m => m.id === id)) {
    return res.status(409).json({ error: "El código del médico ya está registrado." });
  }

  if (editar && id !== idRuta) {
    return res.status(400).json({ error: "No se permite modificar el código del médico." });
  }

  const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  const valido =
    typeof id === "string" && /^MED-\d{3,}$/.test(id) &&
    typeof nombre === "string" &&
      /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ. '\-]+$/.test(nombre.trim()) && nombre.trim().length >= 3 &&
    typeof especialidad === "string" && especialidad.trim().length >= 3 &&
    ["Lima Norte", "Lima Centro", "Lima Sur"].includes(sede) &&
    typeof consultorio === "string" && /^[A-Za-z0-9-]{1,12}$/.test(consultorio) &&
    ["activo", "inactivo"].includes(estado) &&
    Array.isArray(diasDisponibles) && diasDisponibles.length > 0 &&
    diasDisponibles.every(d => dias.includes(d)) &&
    new Set(diasDisponibles).size === diasDisponibles.length &&
    horarioAtencion &&
    esHoraValida(horarioAtencion.horaInicio) &&
    esHoraValida(horarioAtencion.horaFin) &&
    aMinutos(horarioAtencion.horaInicio) < aMinutos(horarioAtencion.horaFin);

  if (!valido) {
    return res.status(400).json({
      error: "Datos del médico inválidos: revisa nombre, código, sede, consultorio, días, horas y estado."
    });
  }

  next();
});

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
    estado = "pendiente"
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
    "pendiente", "aprobada", "rechazada",
    "programada", "atendida", "cancelada", "no_asistio"
  ];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      error: "Estado de cita no válido."
    });
  }

  // 3. Flujo de aprobación administrativa.
  // Las citas nuevas deben entrar como solicitudes pendientes.
  if (esCreacion) {
    if (typeof datos.id !== "string" || !/^CIT-\d{4,}$/.test(datos.id)) {
      return res.status(400).json({ error: "El código debe tener formato CIT-0001." });
    }

    if (estado !== "pendiente") {
      return res.status(400).json({
        error: "Las nuevas citas deben registrarse con estado pendiente."
      });
    }

    if (citas.some(c => String(c.id) === String(datos.id))) {
      return res.status(409).json({ error: "El código de la cita ya existe." });
    }

    // Persistir el valor predeterminado incluso si no llegó en el POST.
    req.body.estado = "pendiente";
  }

  if (esEdicion && estado !== citaActual.estado) {
    const transiciones = {
      pendiente: ["aprobada", "rechazada", "cancelada"],
      aprobada: ["atendida", "cancelada", "no_asistio"],
      programada: ["atendida", "cancelada", "no_asistio"],
      rechazada: [],
      atendida: [],
      cancelada: [],
      no_asistio: []
    };

    if (!transiciones[citaActual.estado]?.includes(estado)) {
      return res.status(409).json({
        error: `No se puede cambiar una cita de ${citaActual.estado} a ${estado}.`
      });
    }
  }

  // 4. Validar estudiante
  const estudiante = db.get("usuarios")
    .find({ id: estudianteId }).value();

  if (!estudiante || estudiante.rol !== "estudiante") {
    return res.status(400).json({
      error: "El estudiante no existe o no es válido."
    });
  }

  // 5. Validar médico
  const medico = db.get("medicos")
    .find({ id: medicoId }).value();

  if (!medico) {
    return res.status(400).json({
      error: "El médico no existe."
    });
  }

  // 6. Validar fecha y horas
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

  // 7. Validar disponibilidad del médico
  const ocupaHorario = !["rechazada", "cancelada"].includes(estado);

  if (ocupaHorario) {
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

    // 8. Verificar cruces
    const existeCruce = citas.some(cita => {
      if (String(cita.id) === idActual) return false;

      // Una cita rechazada o cancelada libera el turno.
      if (["rechazada", "cancelada"].includes(cita.estado)) return false;

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

const PORT = 3000;

server.listen(PORT, () => {
  console.log(
    `MediTurno API: http://localhost:${PORT}`
  );
});
