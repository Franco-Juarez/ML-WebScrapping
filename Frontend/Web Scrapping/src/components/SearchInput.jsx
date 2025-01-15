import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchInput = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-between items-center gap-4 mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Ingresá un producto..."
        className="border border-gray-300 p-2 w-full rounded-md"
      />
      <button
        type="submit"
        className="min-w-[180px] flex gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Crear búsqueda
        <Search />
      </button>
    </form>
  );
}

export default SearchInput;