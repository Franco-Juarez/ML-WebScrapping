const ResultsTable = ({ results = [] }) => {
  return (
    <div>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="text-left px-4 py-2 border">Título</th>
            <th className="text-left px-4 py-2 border">Precio</th>
            <th className="text-left px-4 py-2 border">Envío Gratis</th>
            <th className="text-left px-4 py-2 border">URL</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((result) => (
              <tr key={`${result.productId}`}>
                <td className="px-4 py-2 border">{result.productName}</td>
                <td className="px-4 py-2 border">{result.productPrice}</td>
                <td className="px-4 py-2 border">{result.productFreeShipping ? 'Sí' : 'No'}</td>
                <td className="px-4 py-2 border">
                  <a href={result.productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    Ver producto
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 border text-center">No hay resultados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
