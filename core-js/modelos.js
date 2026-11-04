
// ==========================================
// FUNCION AUXILIAR PARA CONVERTIR HORAS
// ==========================================

const aMinutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
};

// ==========================================
// CLASE USUARIO
// ==========================================

export class Usuario {

    constructor({ id, nombre, correo, codigo, rol, password }) {
        this._id = id;
        this._nombre = nombre;
        this._correo = correo;
        this._codigo = codigo;
        this._rol = rol;
        this._password = password;
    }

    // Getters
    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get correo() {
        return this._correo;
    }

    get codigo() {
        return this._codigo;
    }

    get rol() {
        return this._rol;
    }

    // Método propio
    esAdministrador() {
        return this._rol === "admin";
    }
}

// ==========================================
// CLASE LABORATORIO
// ==========================================

export class Laboratorio {

    constructor({ id, nombre, sede, capacidad, equipos, estado }) {
        this._id = id;
        this._nombre = nombre;
        this._sede = sede;
        this._capacidad = capacidad;
        this._equipos = equipos;
        this._estado = estado;
    }

    // Getters
    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get sede() {
        return this._sede;
    }

    get capacidad() {
        return this._capacidad;
    }

    get equipos() {
        return this._equipos;
    }

    get estado() {
        return this._estado;
    }

    // Método propio
    estaDisponible() {
        return this._estado === "disponible";
    }
}

// ==========================================
// CLASE RESERVA
// ==========================================

export class Reserva {

    constructor({
        id,
        codigo,
        laboratorioId,
        usuarioId,
        fecha,
        horaInicio,
        horaFin,
        motivo,
        estado = "pendiente",
        creadoEn
    }) {
        this._id = id;
        this._codigo = codigo;
        this._laboratorioId = laboratorioId;
        this._usuarioId = usuarioId;
        this._fecha = fecha;
        this._horaInicio = horaInicio;
        this._horaFin = horaFin;
        this._motivo = motivo;
        this._estado = estado;
        this._creadoEn = creadoEn;
    }

    // Getters
    get id() {
        return this._id;
    }

    get codigo() {
        return this._codigo;
    }

    get laboratorioId() {
        return this._laboratorioId;
    }

    get usuarioId() {
        return this._usuarioId;
    }

    get fecha() {
        return this._fecha;
    }

    get horaInicio() {
        return this._horaInicio;
    }

    get horaFin() {
        return this._horaFin;
    }

    get motivo() {
        return this._motivo;
    }

    get estado() {
        return this._estado;
    }

    get creadoEn() {
        return this._creadoEn;
    }

    // Calcula la duración de la reserva en horas
    duracionHoras() {
        const inicio = aMinutos(this._horaInicio);
        const fin = aMinutos(this._horaFin);

        return (fin - inicio) / 60;
    }

    // Comprueba si dos reservas se cruzan
    seCruzaCon(otra) {
        const mismoLaboratorio =
            this._laboratorioId === otra.laboratorioId;

        const mismaFecha =
            this._fecha === otra.fecha;

        const horariosSeCruzan =
            aMinutos(this._horaInicio) < aMinutos(otra.horaFin) &&
            aMinutos(otra.horaInicio) < aMinutos(this._horaFin);

        return mismoLaboratorio && mismaFecha && horariosSeCruzan;
    }
}
