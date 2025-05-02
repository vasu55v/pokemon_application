import React from 'react';
import { Link } from 'react-router-dom';

const PokemonCard = ({ pokemon, isFavorite, toggleFavorite, handleCompare, isCompared }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] w-full max-w-2xl mx-auto p-4 md:flex md:items-center">
      
      {/* Image Section */}
      <Link to={`/pokemon/${pokemon.id}`} className="flex justify-center md:w-1/3 mb-4 md:mb-0">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-28 h-28 md:w-32 md:h-32 drop-shadow-lg"
        />
      </Link>

      {/* Info Section */}
      <div className="md:w-2/3 md:pl-6 text-center md:text-left">
        <Link to={`/pokemon/${pokemon.id}`} className="block">
          <h2 className="text-2xl font-bold capitalize text-gray-800">{pokemon.name}</h2>
          <p className="text-sm text-gray-500">ID: {pokemon.id}</p>
        </Link>

        {/* Types */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold"
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
          <button
            onClick={() => toggleFavorite(pokemon.id)}
            className={`rounded-full px-4 py-1 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
              isFavorite
                ? 'bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-300'
                : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 focus:ring-gray-300'
            }`}
          >
            {isFavorite ? '★ Favorite' : '☆ Favorite'}
          </button>

          <button
            onClick={() => handleCompare(pokemon)}
            className={`rounded-full px-4 py-1 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
              isCompared
                ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 focus:ring-gray-300'
            }`}
          >
            {isCompared ? '✓ Compared' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
