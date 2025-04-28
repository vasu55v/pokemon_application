import React, { useState, useEffect } from 'react';

export default function PokemonExplorer() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [allTypes, setAllTypes] = useState([]);

  // Fetch Pokemon data when component mounts
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        // Fetch the first 150 Pokemon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        // console.log(data.results);
        
        // For each Pokemon, fetch detailed information
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );

        // console.log(pokemonDetails);

        // Extract and collect all unique types
        const types = new Set();
        pokemonDetails.forEach(pokemon => {
          pokemon.types.forEach(type => {
            types.add(type.type.name);
          });
        });
        
        setAllTypes(Array.from(types).sort());
        // console.log( Array.from(types).sort())
        setPokemon(pokemonDetails);
        console.log(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchPokemon();
  }, []);

  // Filter Pokemon based on search term and type filter
  useEffect(() => {
    const filtered = pokemon.filter(p => {
      const matchesSearchTerm = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTypeFilter = 
        typeFilter === 'all' || 
        p.types.some(type => type.type.name === typeFilter);
      
      return matchesSearchTerm && matchesTypeFilter;
    });
    
    setFilteredPokemon(filtered);
  }, [searchTerm, typeFilter, pokemon]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <Header />
        <div className="text-center p-10 bg-red-100 rounded-lg border border-red-300 mx-auto max-w-lg mt-10">
          <div className="text-red-600 text-lg font-semibold">{error}</div>
          <button 
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      <div className="container mx-auto p-4">
        <SearchFilterBar 
          searchTerm={searchTerm} 
          handleSearchChange={handleSearchChange}
          typeFilter={typeFilter}
          handleTypeFilterChange={handleTypeFilterChange}
          allTypes={allTypes}
        />

        {loading ? (
          <LoadingState />
        ) : filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPokemon.map(poke => (
              <PokemonCard key={poke.id} pokemon={poke} />
            ))}
          </div>
        ) : (
          <EmptyState searchTerm={searchTerm} typeFilter={typeFilter} />
        )}
      </div>
    </div>
  );
}

// Header Component
function Header() {
  return (
    <header className="bg-red-600 text-white p-6 shadow-md mb-6">
      <div className="container mx-auto flex items-center justify-center">
        <h1 className="text-3xl font-bold">Pokemon Explorer</h1>
      </div>
    </header>
  );
}

// Search and Filter Component
function SearchFilterBar({ searchTerm, handleSearchChange, typeFilter, handleTypeFilterChange, allTypes }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="md:flex md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="md:w-2/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="md:w-1/3 md:ml-6">
          <select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white transition"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '0.75rem' }}
          >
            <option value="all">All Types</option>
            {allTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Pokemon Card Component
function PokemonCard({ pokemon }) {
  const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-300',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-green-600',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-600',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-300',
    };
    
    return typeColors[type] || 'bg-gray-300';
  };

  const getCardBgColor = (type) => {
    const bgColors = {
      normal: 'from-gray-100 to-gray-200',
      fire: 'from-red-50 to-red-100',
      water: 'from-blue-50 to-blue-100',
      electric: 'from-yellow-50 to-yellow-100',
      grass: 'from-green-50 to-green-100',
      ice: 'from-blue-50 to-blue-100',
      fighting: 'from-red-50 to-red-100',
      poison: 'from-purple-50 to-purple-100',
      ground: 'from-yellow-50 to-yellow-100',
      flying: 'from-indigo-50 to-indigo-100',
      psychic: 'from-pink-50 to-pink-100',
      bug: 'from-green-50 to-green-100',
      rock: 'from-yellow-50 to-yellow-100',
      ghost: 'from-purple-50 to-purple-100',
      dragon: 'from-indigo-50 to-indigo-100',
      dark: 'from-gray-100 to-gray-200',
      steel: 'from-gray-100 to-gray-200',
      fairy: 'from-pink-50 to-pink-100',
    };
    
    return bgColors[type] || 'from-gray-100 to-gray-200';
  };

  const mainType = pokemon.types[0].type.name;
  const bgGradient = getCardBgColor(mainType);

  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1`}>
      <div className="p-4 flex flex-col items-center">
        <div className="rounded-full bg-white shadow-inner p-2 mb-4">
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="h-32 w-32"
          />
        </div>
        
        <div className="text-center w-full">
          <div className="flex justify-between items-center px-2 mb-3">
            <span className="text-gray-500 font-medium text-sm">#{String(pokemon.id).padStart(3, '0')}</span>
            <h2 className="text-xl font-bold capitalize text-gray-800">{pokemon.name}</h2>
          </div>
          
          <div className="flex justify-center gap-2 mb-2">
            {pokemon.types.map(typeInfo => (
              <span 
                key={typeInfo.type.name}
                className={`${getTypeColor(typeInfo.type.name)} px-3 py-1 rounded-full text-xs font-medium capitalize text-white`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white bg-opacity-60 rounded-lg p-2">
              <p className="text-gray-500">Height</p>
              <p className="font-medium">{pokemon.height / 10} m</p>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-2">
              <p className="text-gray-500">Weight</p>
              <p className="font-medium">{pokemon.weight / 10} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-16">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 bg-red-600 w-20 h-10 rounded-t-full"></div>
        <div className="absolute bottom-0 bg-white w-20 h-10 rounded-b-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white w-6 h-6 rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 font-medium">Loading Pokémon data...</p>
    </div>
  );
}

// Empty State Component
function EmptyState({ searchTerm, typeFilter }) {
  return (
    <div className="text-center p-12 bg-white rounded-lg border border-gray-200 shadow-md">
      <div className="text-gray-400 text-5xl mb-4">😕</div>
      <div className="text-gray-700 text-xl font-medium mb-2">
        No Pokémon found
      </div>
      <p className="text-gray-500">
        {searchTerm && <span>No matches for "{searchTerm}" </span>}
        {typeFilter !== 'all' && <span>{searchTerm ? 'with' : 'No Pokémon with'} type "{typeFilter}"</span>}
      </p>
      <p className="mt-4 text-gray-500">Try adjusting your search criteria</p>
    </div>
  );
}