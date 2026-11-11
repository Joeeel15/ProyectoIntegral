import { useEffect, useState } from 'react';

function useCuentaRegresiva(fechaHora) {
  const [instanteActual, setInstanteActual] = useState(() => Date.now());

  useEffect(() => {
    if (!fechaHora) return undefined;

    const intervalo = setInterval(() => {
      setInstanteActual(Date.now());
    }, 1000);

    // No dejar temporizadores funcionando al cambiar de ruta o fecha.
    return () => clearInterval(intervalo);
  }, [fechaHora]);

  if (!fechaHora) return null;

  const objetivo = new Date(fechaHora).getTime();
  if (Number.isNaN(objetivo)) return null;

  const segundosTotales = Math.floor(Math.max(0, objetivo - instanteActual) / 1000);

  return {
    dias: Math.floor(segundosTotales / 86400),
    horas: Math.floor((segundosTotales % 86400) / 3600),
    minutos: Math.floor((segundosTotales % 3600) / 60),
    segundos: segundosTotales % 60,
  };
}

export default useCuentaRegresiva;
