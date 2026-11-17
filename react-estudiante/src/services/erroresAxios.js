// Traduce errores de Axios a mensajes legibles para la interfaz.
// Se mantiene separado del paquete axios para poder probarlo con node:test.
export function traducirErrorAxios(error) {
  if (error?.code === 'ERR_CANCELED') return error;

  const estado = error?.response?.status;
  const datos = error?.response?.data;
  const mensajeServidor = typeof datos?.error === 'string'
    ? datos.error
    : typeof datos?.message === 'string' ? datos.message : null;

  const mensajes = {
    400: 'Los datos de la solicitud son inválidos.',
    401: 'Necesitas iniciar sesión para continuar.',
    403: 'No tienes permiso para realizar esta operación.',
    404: 'La cita solicitada no existe (HTTP 404).',
    409: 'El horario ya está ocupado o la operación no está permitida (HTTP 409).',
    500: 'Ocurrió un error interno en el servidor.',
  };

  const mensaje = mensajeServidor || mensajes[estado] || (
    estado
      ? `La solicitud no pudo completarse (HTTP ${estado}).`
      : error?.code === 'ECONNABORTED'
        ? 'La API tardó demasiado en responder.'
        : 'No se pudo conectar con la API de MediTurno (puerto 3000).'
  );

  const traducido = new Error(mensaje);
  traducido.status = estado ?? null;
  traducido.cause = error;
  return traducido;
}

export function instalarInterceptorErrores(cliente) {
  cliente.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => Promise.reject(traducirErrorAxios(error)),
  );
  return cliente;
}
