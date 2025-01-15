import './App.css';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchInput from './components/SearchInput';
import ResultsTable from './components/ResultsTable';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { CircleDollarSign, ShoppingBasketIcon } from 'lucide-react';

function App() {
  const [searchResults, setSearchResults] = useState([]); 
  const [previousSearches, setPreviousSearches] = useState([]);
  const [previousSearchResults, setPreviousSearchResults] = useState([]);
  const [cheapestProducts, setCheapestProducts] = useState([]);
  const [showCheapest, setShowCheapest] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener todos los searchId de la base de datos al montar la app
  const fetchAllSearchIds = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product_searchId/');
      setPreviousSearches(response.data); 
    } catch (error) {
      console.error('Error al obtener los searchIds:', error.message);
    }
  };

  // Llamar a fetchAllSearchIds al montar la app
  useEffect(() => {
    fetchAllSearchIds();
  }, []);

  // Obtener los resultados para cada searchId
  const fetchSearchResults = async (searchId) => {
    try {
      const result = await axios.get(`http://localhost:3000/api/search_product/${searchId}`);
      setPreviousSearchResults((prevResults) => [
        ...prevResults,
        { searchId, results: result.data },
      ]);
    } catch (error) {
      console.error('Error al obtener los resultados de búsqueda:', error.message);
    }
  };

  // Llamar a fetchSearchResults para cada searchId
  useEffect(() => {
    previousSearches.forEach((search) => {
      fetchSearchResults(search.searchId); // Pasamos el searchId correcto
    });
  }, [previousSearches]);

  // Obtener los 10 productos más baratos para todos los searchId
  const fetchCheapestProductsForAll = async () => {
    try {
      const cheapestResults = await Promise.all(
        previousSearches.map((search) =>
          axios.get(`http://localhost:3000/api/products/cheapest-products/${search.searchId}`)
        )
      );

      // Actualizar el estado con los productos más baratos para cada búsqueda
      const cheapestProductsData = cheapestResults.map((response, index) => ({
        searchId: previousSearches[index].searchId,
        products: response.data,
      }));

      setCheapestProducts(cheapestProductsData);
      setShowCheapest(true);
    } catch (error) {
      console.error('Error al obtener los productos más baratos:', error.message);
    }
  };

  // Mostrar todos los productos de las búsquedas previas
  const toggleShowCheapest = () => {
    setShowCheapest((prevState) => !prevState);
  };

  // Función para eliminar una búsqueda
  const handleDeleteSearch = async (searchId) => {
    try {
      await axios.delete(`http://localhost:3000/api/search_product/${searchId}`);
      // Actualizamos las búsquedas previas después de eliminar
      setPreviousSearches((prevSearches) => prevSearches.filter((search) => search.searchId !== searchId));
      setPreviousSearchResults((prevResults) => prevResults.filter((result) => result.searchId !== searchId));
      setCheapestProducts((prevProducts) => prevProducts.filter((product) => product.searchId !== searchId));
    } catch (error) {
      console.error('Error al eliminar la búsqueda:', error.message);
    }
  };

  // Manejo de búsqueda actual
  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);

      console.log('Buscando:', searchTerm);

      // Paso 1: Crear una nueva búsqueda
      await axios.post(`http://localhost:3000/api/search_product/${searchTerm}`);

      // Paso 2: Obtener el searchId para el término de búsqueda
      const searchIdResponse = await axios.get(`http://localhost:3000/api/product_searchId/${searchTerm}`);
      const searchId = searchIdResponse.data;
      console.log('Search ID:', searchId);

      // Paso 3: Obtener los resultados de la búsqueda con el searchId
      const result = await axios.get(`http://localhost:3000/api/search_product/${searchId}`);
      setSearchResults(result.data);
      console.log('Resultados:', result.data);

      setLoading(false);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error.message);
      setSearchResults([]);
      setLoading(false);
    }
  };

  // Ordenar las búsquedas previas y resultados
  const sortedPreviousSearches = previousSearches.sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedPreviousSearchResults = previousSearchResults.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <SearchInput onSearch={handleSearch} />

        {/* Loader */}
        {loading && (
          <div className="flex flex-col justify-center items-center w-full mt-6">
            <div className="loader"></div>
            <p>Buscando producto</p>
          </div>
        )}

        {/* Botón para actualizar todas las tablas con los productos más baratos */}
        <button
          className="flex gap-2 mt-6 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => {
            toggleShowCheapest();
            if (!showCheapest) fetchCheapestProductsForAll();
          }}
        >
          {showCheapest ? 'Ver todos los productos'   : 'Productos más baratos' }
          {showCheapest ? <ShoppingBasketIcon /> : <CircleDollarSign />  }
        </button>

        {/* Mostrar los resultados de la búsqueda actual */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Resultados de la Búsqueda Actual</h2>
            <ResultsTable results={searchResults} />
          </div>
        )}

        {/* Mostrar las búsquedas previas */}
        {previousSearches.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Búsquedas Previas</h2>
            {sortedPreviousSearches.map((search) => {
              const searchResult = sortedPreviousSearchResults.find(
                (result) => result.searchId === search.searchId
              );
              const cheapestResult = cheapestProducts.find(
                (product) => product.searchId === search.searchId
              );

              return (
                <div key={search.searchId} className="mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg">{search.searchTerm}</h3>
                    <button
                      onClick={() => handleDeleteSearch(search.searchId)}
                      className="bg-red-500 text-white px-4 py-2 rounded flex gap-2"
                    >
                      Eliminar Búsqueda
                    <Trash2 />
                    </button>
                  </div>

                  {/* Mostrar los resultados de la búsqueda */}
                  {searchResult && !showCheapest && (
                    <>
                      <ResultsTable results={searchResult.results} />
                    </>
                  )}

                  {/* Mostrar los 10 productos más baratos */}
                  {showCheapest && cheapestResult && (
                    <>
                      <h3 className="font-semibold text-lg mt-4">Productos Más Baratos</h3>
                      <ResultsTable results={cheapestResult.products} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
