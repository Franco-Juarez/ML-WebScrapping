const Header = () => {
  return (
    <header className="bg-yellow-400 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-slate-800">ML Scraper</div>
      <nav>
        <a
          href="https://portfolio-1gn6.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-800 font-bold"
        >
          Más proyectos
        </a>
      </nav>
    </header>
  );
}

export default Header;
