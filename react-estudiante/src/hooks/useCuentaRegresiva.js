import { useEffect, useState } from 'react';

function useCuentaRegresiva(fechaHora) {
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    if (!fechaHora) {
      setTiempoRestante(null);
      return;
    }

    const calcularTiempo = () => {
      const diferencia =
        new Date(fechaHora).getTime() - Date.now();

      setTiempoRestante(Math.max(0, diferencia));
    };

    calcularTiempo();

    const intervalo = setInterval(calcularTiempo, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [fechaHora]);

  if (tiempoRestante === null) {
    return null;
  }

  const segundosTotales = Math.floor(tiempoRestante / 1000);

  const dias = Math.floor(segundosTotales / 86400);

  const horas = Math.floor((segundosTotales % 86400) / 3600);

  const minutos = Math.floor((segundosTotales % 3600) / 60);

  const segundos = segundosTotales % 60;

  return {
    dias,
    horas,
    minutos,
    segundos
  };
}

export default useCuentaRegresiva;
