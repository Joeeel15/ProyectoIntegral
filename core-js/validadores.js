
// ==========================================
// VALIDADORES DE CAMPUSHUB
// ==========================================

// 1. Validar correo institucional UTP
export const esCorreoUTP = (correo) => {
    const regex = /^[a-z0-9._%+-]+@utp\.edu\.pe$/i;
    return regex.test(correo);
};

// 2. Validar código de alumno: U + 8 dígitos
export const esCodigoAlumno = (codigo) => {
    const regex = /^U\d{8}$/;
    return regex.test(codigo);
};

// 3. Validar hora en formato HH:mm (24 horas)
export const esHora = (hora) => {
    const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(hora);
};

// 4. Validar fecha en formato AAAA-MM-DD
export const esFecha = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(fecha)) {
        return false;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);

    const fechaReal = new Date(Date.UTC(anio, mes - 1, dia));

    return (
        fechaReal.getUTCFullYear() === anio &&
        fechaReal.getUTCMonth() === mes - 1 &&
        fechaReal.getUTCDate() === dia
    );
};

// ==========================================
// MENSAJES DE ERROR CON TEMPLATE LITERALS
// ==========================================

export const validarCorreoUTP = (correo) => {
    if (!esCorreoUTP(correo)) {
        return `El correo "${correo}" no es válido. Debe pertenecer al dominio @utp.edu.pe.`;
    }

    return null;
};

export const validarCodigoAlumno = (codigo) => {
    if (!esCodigoAlumno(codigo)) {
        return `El código "${codigo}" no es válido. Debe comenzar con U y contener 8 dígitos.`;
    }

    return null;
};

export const validarHora = (hora) => {
    if (!esHora(hora)) {
        return `La hora "${hora}" no es válida. Utiliza el formato HH:mm entre 00:00 y 23:59.`;
    }

    return null;
};

export const validarFecha = (fecha) => {
    if (!esFecha(fecha)) {
        return `La fecha "${fecha}" no es válida. Utiliza el formato AAAA-MM-DD y una fecha existente.`;
    }

    return null;
};
