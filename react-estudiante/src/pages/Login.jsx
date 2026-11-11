import { useState } from 'react';
import { usuarios } from '../data/mediturnoData';

function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    setError('');

    const usuario = usuarios.find(
      (item) => item.correo.toLowerCase() === correo.trim().toLowerCase()
    );

    if (!usuario || !usuario.verificarPassword(password)) {
      setError('El correo o la contraseña son incorrectos.');
      return;
    }

    if (usuario.rol !== 'estudiante') {
      setError('Este portal es exclusivo para estudiantes.');
      return;
    }

    onLogin(usuario);
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="fw-bold text-center mb-2">
                Iniciar sesión
              </h2>
              <p className="text-muted text-center mb-4">
                Ingresa con tu cuenta de estudiante.
              </p>

              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label className="form-label">Correo institucional</label>
                  <input
                    type="email"
                    className="form-control"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="U20230002@utp.edu.pe"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                <button className="btn btn-primary w-100" type="submit">
                  Ingresar
                </button>
              </form>

              <p className="text-muted small mt-3 mb-0">
                Acceso de demostración con los usuarios locales del proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
