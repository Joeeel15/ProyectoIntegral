import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState('claro');

  const cambiarTema = () => {
    setTema((anterior) =>
      anterior === 'claro' ? 'oscuro' : 'claro'
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        tema,
        cambiarTema,
        esOscuro: tema === 'oscuro'
      }}
    >
      <div className={tema === 'oscuro' ? 'tema-oscuro' : 'tema-claro'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexto = useContext(ThemeContext);

  if (!contexto) {
    throw new Error('useTheme debe utilizarse dentro de ThemeProvider');
  }

  return contexto;
}
