export const AdminCategorias = () => {
  return (
    <div>
      {/* Cabecera con título y botón de acción */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
          + Nueva Categoría
        </button>
      </div>

      {/* Contenedor principal donde irá la tabla */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-600">
          Acá vamos a cargar la tabla para gestionar las categorías de la tienda (ej: Mochilas, Carteras, Billeteras).
        </p>
      </div>
    </div>
  );
};