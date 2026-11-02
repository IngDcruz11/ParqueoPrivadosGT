import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios'; // Ajusta la ruta a tu instancia de Axios

export const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Petición al endpoint de login del backend
      const response = await api.post('/auth/login', { correo, password });

      if (response.data && response.data.estado) {
        const { accessToken, refreshToken } = response.data;

        // Guardamos tanto el Token de Acceso como el Refresh Token en el localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Redirigimos al panel principal de acceso
        navigate('/empleados', { replace: true });
      }
    } catch (err: any) {
      console.error('Error en el inicio de sesión:', err);
      setError(err.response?.data?.message || 'Credenciales incorrectas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Parqueo Privados GT</h1>
          <p className="text-sm text-slate-400 mt-1">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="nombre@correo.com"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg text-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};