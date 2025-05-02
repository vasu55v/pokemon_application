import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PokemonDetail from "./components/PokemonDetail";
import PokemonExplorer from "./pages/PokemonExplorer";
import Favorites from "./pages/Favorites";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-red-600 via-pink-600 to-red-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2"
            >
              <span role="img" aria-label="fire">🔥</span> Pokemon Explorer
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/favorites"
                className="bg-white text-red-600 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-red-100 transition"
              >
                ❤️ Favorites
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Nav */}
          {menuOpen && (
            <div className="md:hidden px-4 pb-4 space-y-2">
              <Link
                to="/favorites"
                onClick={() => setMenuOpen(false)}
                className="block bg-white text-red-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-red-100 transition"
              >
                ❤️ Favorites
              </Link>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="container mx-auto flex-grow py-6 px-4">
          <Routes>
            <Route path="/" element={<PokemonExplorer />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-sm py-6 mt-8">
          <div className="container mx-auto text-center px-4">
            <p>
              © {new Date().getFullYear()} Pokémon Explorer | Data from{" "}
              <a
                href="https://pokeapi.co/"
                className="text-blue-400 hover:underline hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                PokéAPI
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
