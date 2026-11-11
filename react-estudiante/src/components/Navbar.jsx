import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar({ usuario = null, onCerrarSesion }) {
  const { tema, cambiarTema, esOscuro } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          MediTurno
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Mostrar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/">
              Inicio
            </NavLink>

            <NavLink className="nav-link" to="/catalogo">
              Médicos
            </NavLink>

            {usuario && (
              <>
                <NavLink className="nav-link" to="/mis-reservas">
                  Mis citas
                </NavLink>

                <NavLink className="nav-link" to="/nueva-reserva">
                  Nueva cita
                </NavLink>
              </>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={cambiarTema}
              type="button"
            >
              {esOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro'}
            </button>

            {usuario ? (
              <>
                <span className="text-white">
                  Hola, {usuario.nombre}
                </span>

                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={onCerrarSesion}
                  type="button"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="btn btn-light btn-sm" to="/login">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
