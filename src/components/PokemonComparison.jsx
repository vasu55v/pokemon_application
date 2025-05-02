import React from 'react';

const StatBar = ({ label, value }) => {
  const getColor = (val) => {
    if (val >= 100) return 'bg-green-500';
    if (val >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm text-gray-700 mb-1">
        <span className="capitalize font-medium">{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor(value)}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

const PokemonComparison = ({ compareList }) => {
  if (compareList.length !== 2) return null;

  return (
    <div className="bg-gradient-to-br from-blue-100 to-white border border-blue-200 rounded-2xl p-8 mb-6 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">Pokémon Side-by-Side</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {compareList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300"
          >
            <img
              src={
                pokemon.sprites.other['official-artwork'].front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              className="w-28 h-28 mx-auto mb-4 drop-shadow"
            />

            <h3 className="text-xl font-semibold capitalize text-gray-800">{pokemon.name}</h3>
            <p className="text-sm text-gray-400 mb-3">ID: {pokemon.id}</p>

            <div className="flex justify-center gap-2 flex-wrap mb-4">
              {pokemon.types.map((typeObj) => (
                <span
                  key={typeObj.type.name}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {typeObj.type.name}
                </span>
              ))}
            </div>

            <div className="text-left">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Base Stats</h4>
              {pokemon.stats.map((stat) => (
                <StatBar
                  key={stat.stat.name}
                  label={stat.stat.name}
                  value={stat.base_stat}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonComparison;
