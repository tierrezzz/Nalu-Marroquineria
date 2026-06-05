import { useState, useEffect } from 'react';
import axios from 'axios';

export const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de creación
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [creando, setCreando] = useState(false);

  // Estados para la edición en línea
  const [categoriaEditando, setCategoriaEditando] = useState(null); // Guarda el ID de la que se está editando
  const [nombreEditado, setNombreEditado] = useState('');

  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const respuesta = await axios.get('http://localhost:3000/categorias', config); 
      
      setCategorias(respuesta.data.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("No tenés permisos suficientes o tu sesión expiró.");
      } else {
        setError("Error de conexión con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función POST: Crear
  const crearCategoria = async (e) => {
    e.preventDefault(); 
    if (!nombreCategoria.trim()) return; 

    try {
      setCreando(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('http://localhost:3000/categorias', {
        nombre: nombreCategoria
      }, config);

      setNombreCategoria('');
      setMostrarFormulario(false);
      obtenerCategorias(); 

    } catch (err) {
      console.error("Error detallado:", err.response?.data);
      const mensajeError = err.response?.data?.message 
        || err.response?.data?.errors?.[0]?.msg 
        || "No se pudo crear la categoría.";
        
      setError(`Error al crear: ${mensajeError}`);
    } finally {
      setCreando(false);
    }
  };

  // Función DELETE: Eliminar
  const eliminarCategoria = async (id) => {
    // Pedimos confirmación antes de disparar la petición
    if (!window.confirm("¿Estás seguro de que querés eliminar esta categoría?")) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:3000/categorias/${id}`, config);
      obtenerCategorias(); // Recargamos la tabla al borrar
    } catch (err) {
      const mensajeError = err.response?.data?.message || "No se pudo eliminar la categoría.";
      setError(`Error al eliminar: ${mensajeError}`);
    }
  };

  // Funciones para la Edición
  const iniciarEdicion = (categoria) => {
    setCategoriaEditando(categoria.id);
    setNombreEditado(categoria.nombre);
  };

  const cancelarEdicion = () => {
    setCategoriaEditando(null);
    setNombreEditado('');
  };

  const guardarEdicion = async (id) => {
    if (!nombreEditado.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Hacemos el PUT al backend
      await axios.put(`http://localhost:3000/categorias/${id}`, {
        nombre: nombreEditado
      }, config);

      setCategoriaEditando(null); // Cerramos el modo edición
      obtenerCategorias(); // Recargamos la tabla

    } catch (err) {
      const mensajeError = err.response?.data?.message 
        || err.response?.data?.errors?.[0]?.msg 
        || "No se pudo editar la categoría.";
      setError(`Error al editar: ${mensajeError}`);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <div>
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        <button 
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            cancelarEdicion(); // Si abre para crear, cerramos cualquier edición activa
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <span>{mostrarFormulario ? 'Cancelar' : '+ Nueva Categoría'}</span>
        </button>
      </div>

      {/* Formulario de Creación */}
      {mostrarFormulario && (
        <form onSubmit={crearCategoria} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              id="nombre"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              placeholder="Ej: Mochilas, Carteras, Billeteras..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={creando || !nombreCategoria.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {creando ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      )}

      {/* Manejo de errores general */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex justify-between items-center">
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">X</button>
        </div>
      )}

      {/* Tabla de Categorías */}
      {loading ? (
        <p className="text-gray-500">Cargando categorías...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                {/* <th className="p-4 font-semibold">ID</th> */}
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-gray-500">
                    No hay categorías registradas todavía.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Celda del Nombre: Condicional si se está editando */}
                    <td className="p-4 font-medium text-gray-800">
                      {categoriaEditando === cat.id ? (
                        <input
                          type="text"
                          value={nombreEditado}
                          onChange={(e) => setNombreEditado(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        cat.nombre
                      )}
                    </td>

                    {/* Celda de Acciones: Condicional si se está editando */}
                    <td className="p-4 text-right">
                      {categoriaEditando === cat.id ? (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => guardarEdicion(cat.id)}
                            className="text-green-600 hover:text-green-800 font-semibold text-sm bg-green-50 px-3 py-1 rounded"
                          >
                            Guardar
                          </button>
                          <button 
                            onClick={cancelarEdicion}
                            className="text-gray-500 hover:text-gray-700 font-semibold text-sm bg-gray-100 px-3 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-4">
                          <button 
                            onClick={() => iniciarEdicion(cat)}
                            className="text-blue-500 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => eliminarCategoria(cat.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};