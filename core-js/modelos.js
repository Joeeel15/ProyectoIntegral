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
  constructor({ id, nombre, correo, codigo, rol, password, sede = null }) {
    this._id = id;
    this._nombre = nombre;
    this._correo = correo;
    this._codigo = codigo;
    this._rol = rol;
    this._password = password;
    this._sede = sede;
  }

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
  get sede() {
    return this._sede;
  }

  esAdministrador() {
    return this._rol === "admin";
  }

  verificarPassword(password) {
    return this._password === password;
  }
}

// ==========================================
// CLASE MÉDICO
// ==========================================

export class Medico {
  constructor(
    id,
    nombre,
    especialidad,
    consultorio,
    sede = null,
    diasDisponibles = [],
    horarioAtencion = {},
    estado = "activo",
  ) {
    this._id = id;
    this._nombre = nombre;
    this._especialidad = especialidad;
    this._consultorio = consultorio;
    this._sede = sede;
    this._diasDisponibles = diasDisponibles;
    this._horarioAtencion = horarioAtencion;
    this._estado = estado;
  }

  get id() {
    return this._id;
  }
  get nombre() {
    return this._nombre;
  }
  get especialidad() {
    return this._especialidad;
  }
  get consultorio() {
    return this._consultorio;
  }
  get sede() {
    return this._sede;
  }
  get diasDisponibles() {
    return this._diasDisponibles;
  }
  get horarioAtencion() {
    return this._horarioAtencion;
  }
  get estado() {
    return this._estado;
  }
}

// ==========================================
// CLASE CITA
// ==========================================

export class Cita {
  constructor(
    id,
    medicoId,
    estudianteId,
    fecha,
    horaInicio,
    horaFin,
    estado = "programada",
    creadoEn = new Date().toISOString(),
  ) {
    this._id = id;
    this._medicoId = medicoId;
    this._estudianteId = estudianteId;
    this._fecha = fecha;
    this._horaInicio = horaInicio;
    this._horaFin = horaFin;
    this._estado = estado;
    this._creadoEn = creadoEn;
  }

  get id() {
    return this._id;
  }
  get medicoId() {
    return this._medicoId;
  }
  get estudianteId() {
    return this._estudianteId;
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
  get estado() {
    return this._estado;
  }
  get creadoEn() {
    return this._creadoEn;
  }

  seCruzaCon(otraCita) {
    if (!(otraCita instanceof Cita))
      throw new Error("Debe comparar con otra instancia de Cita");

    const mismoMedico = this._medicoId === otraCita.medicoId;
    const mismaFecha = this._fecha === otraCita.fecha;
    const cruceHorario =
      this._horaInicio < otraCita.horaFin &&
      this._horaFin > otraCita.horaInicio;

    return mismoMedico && mismaFecha && cruceHorario;
  }
}
