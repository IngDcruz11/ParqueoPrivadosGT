import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios'; // Asegúrate de que la ruta a tu instancia de axios sea correcta

export const EmpleadosPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Buscamos el token en las llaves más comunes que usan los backends de NestJS / Axios
    const possibleTokenKeys = ['token', 'access_token', 'accessToken', 'jwt', 'auth_token'];
    let foundToken = '';

    for (const key of possibleTokenKeys) {
      const val = localStorage.getItem(key);
      if (val) {
        foundToken = val;
        break;
      }
    }

    // Si no se encontró en las llaves comunes, buscamos si hay algún valor largo que parezca un JWT en el localStorage
    if (!foundToken) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key);
          if (val && val.length > 20) { // Los JWT suelen ser cadenas largas
            foundToken = val;
            break;
          }
        }
      }
    }

    setToken(foundToken || 'No se encontró ningún token activo en el almacenamiento local.');
  }, []);

  const handleLogout = async () => {
    try {
      // Obtenemos el token activo actual
      const activeToken = localStorage.getItem('token') || localStorage.getItem('access_token') || token;
      
      if (activeToken && !activeToken.startsWith('No se encontró')) {
        // Notificamos al backend para que registre el token en la tabla token_blacklist
        await api.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${activeToken}`
          }
        });
      }
    } catch (error) {
      console.error('Error al notificar el cierre de sesión al servidor', error);
    } finally {
      // Limpiamos totalmente el almacenamiento local y regresamos al login
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const copiarToken = () => {
    if (token.startsWith('No se encontró')) return;
    navigator.clipboard.writeText(token);
    alert('¡Token copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Panel de Acceso - Parqueo Privados GT, S. A.</h1>
            <p className="text-sm text-slate-400 mt-1">Sesión autenticada correctamente</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl shadow-xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-indigo-400">Tu Token de Acceso (JWT)</h2>
            <button
              onClick={copiarToken}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Copiar Token
            </button>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <pre className="text-xs text-slate-300 font-mono break-all whitespace-pre-wrap">
              {token}
            </pre>
          </div>

          <p className="text-xs text-slate-400">
            * Al hacer clic en <strong>Cerrar Sesión</strong>, se enviará el token al servidor para ingresarlo a la lista negra, se limpiará el almacenamiento local y se invalidará el acceso por completo.
          </p>
        </div>
      </div>
      
      <footer className="text-center text-xs text-slate-600 mt-8">
        Parqueo Privados GT, S. A. © 2026
      </footer>
    </div>
  );
};