
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Validar formato de fecha y comprobar que exista.
const esFechaValida = (fecha) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaReal = new Date(Date.UTC(anio, mes - 1, dia));

    return fechaReal.getUTCFullYear() === anio &&
        fechaReal.getUTCMonth() === mes - 1 &&
        fechaReal.getUTCDate() === dia;
};

// Convertir HH:mm a minutos para comparar horarios.
const aMinutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
};

const esHoraValida = (hora) => {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
};

// Middleware con reglas de negocio.
server.use((req, res, next) => {

    // -----------------------------------------
    // VALIDAR CORREO DE ESTUDIANTES
    // -----------------------------------------

    const esRegistroEstudiante =
        req.method === "POST" && req.path === "/estudiantes";

    const esEdicionEstudiante =
        req.method === "PUT" && /^\/estudiantes\/\d+$/.test(req.path);

    if (esRegistroEstudiante || esEdicionEstudiante) {
        const { codigo, correo } = req.body;

        const codigoValido = /^U\d{8}$/.test(codigo || "");
        const correoEsperado = `${codigo}@utp.edu.pe`;

        if (!codigoValido || correo !== correoEsperado) {
            return res.status(400).json({
                error: "El correo debe coincidir exactamente con el código del estudiante y utilizar el dominio @utp.edu.pe."
            });
        }
    }

    // -----------------------------------------
    // VALIDAR CREACIÓN Y EDICIÓN DE RESERVAS
    // -----------------------------------------

    const esNuevaReserva =
        req.method === "POST" && req.path === "/reservas";

    const esEdicionReserva =
        req.method === "PUT" && /^\/reservas\/\d+$/.test(req.path);

    if (esNuevaReserva || esEdicionReserva) {
        const {
            usuarioId,
            laboratorioId,
            fecha,
            horaInicio,
            horaFin
        } = req.body;

        // Comprobar que se hayan enviado los datos.
        if (
            usuarioId === undefined ||
            laboratorioId === undefined ||
            !fecha ||
            !horaInicio ||
            !horaFin
        ) {
            return res.status(400).json({
                error: "Faltan datos obligatorios para registrar la reserva."
            });
        }

        // Comprobar que el estudiante exista.
        const estudiante = router.db
            .get("estudiantes")
            .find({ id: Number(usuarioId) })
            .value();

        if (!estudiante) {
            return res.status(400).json({
                error: "El estudiante indicado no existe."
            });
        }

        // Comprobar que el laboratorio exista.
        const laboratorio = router.db
            .get("laboratorios")
            .find({ id: Number(laboratorioId) })
            .value();

        if (!laboratorio) {
            return res.status(400).json({
                error: "El laboratorio indicado no existe."
            });
        }

        // No permitir reservar laboratorios en mantenimiento.
        if (laboratorio.estado !== "disponible") {
            return res.status(400).json({
                error: "El laboratorio no se encuentra disponible."
            });
        }

        // Validar fecha y horarios.
        if (
            !esFechaValida(fecha) ||
            !esHoraValida(horaInicio) ||
            !esHoraValida(horaFin)
        ) {
            return res.status(400).json({
                error: "La fecha o el formato de los horarios no son válidos."
            });
        }

        if (aMinutos(horaInicio) >= aMinutos(horaFin)) {
            return res.status(400).json({
                error: "La hora de inicio debe ser anterior a la hora de finalización."
            });
        }

        // Obtener todas las reservas registradas.
        const reservas = router.db
            .get("reservas")
            .value();

        // Identificar la reserva que se está editando, si corresponde.
        const idActual = esEdicionReserva
            ? req.path.split("/").pop()
            : null;

        // Comprobar si existe un cruce de horarios.
        const existeCruce = reservas.some((reserva) => {
            const esLaMismaReserva =
                idActual !== null &&
                String(reserva.id) === String(idActual);

            if (esLaMismaReserva) {
                return false;
            }

            // Las reservas rechazadas no ocupan el laboratorio.
            if (reserva.estado === "rechazada") {
                return false;
            }

            const mismoLaboratorio =
                Number(reserva.laboratorioId) === Number(laboratorioId);

            const mismaFecha = reserva.fecha === fecha;

            const horariosSeCruzan =
                aMinutos(horaInicio) < aMinutos(reserva.horaFin) &&
                aMinutos(reserva.horaInicio) < aMinutos(horaFin);

            return mismoLaboratorio && mismaFecha && horariosSeCruzan;
        });

        if (existeCruce) {
            return res.status(409).json({
                error: "El laboratorio ya tiene una reserva en ese horario. Selecciona otro horario."
            });
        }
    }

    next();
});

// Activar las rutas REST automáticas de JSON Server.
server.use(router);

// Iniciar el servidor.
const PORT = 3001;

server.listen(PORT, () => {
    console.log(`CampusHub API ejecutándose en http://localhost:${PORT}`);
});
