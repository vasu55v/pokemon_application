import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingState from './LoadingState';

export default function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch basic Pokemon data
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await pokemonResponse.json();
        setPokemon(pokemonData);
        
        // Fetch species data which contains evolution chain URL
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);
        
        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        setEvolutionChain(evolutionData);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokemon details. Please try again later.");
        setLoading(false);
        console.error("Error fetching Pokemon details:", err);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  // Helper function to extract Pokemon ID from URL
  const extractIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  // Helper function to get evolution chain data
  const getEvolutionChain = (chain) => {
    const evolutions = [];
    let currentEvolution = chain;

    // Process the first Pokemon in the chain
    evolutions.push({
      name: currentEvolution.species.name,
      id: extractIdFromUrl(currentEvolution.species.url),
    });

    // Process the rest of the evolution chain
    while (currentEvolution.evolves_to.length > 0) {
      currentEvolution = currentEvolution.evolves_to[0];
      evolutions.push({
        name: currentEvolution.species.name,
        id: extractIdFromUrl(currentEvolution.species.url),
      });
    }

    return evolutions;
  };

  // Format a stat name for display
  const formatStatName = (statName) => {
    switch(statName) {
      case 'hp':
        return 'HP';
      case 'attack':
        return 'Attack';
      case 'defense':
        return 'Defense';
      case 'special-attack':
        return 'Sp. Attack';
      case 'special-defense':
        return 'Sp. Defense';
      case 'speed':
        return 'Speed';
      default:
        return statName.charAt(0).toUpperCase() + statName.slice(1).replace('-', ' ');
    }
  };

  if (loading) {
    return (
       <LoadingState />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!pokemon || !species || !evolutionChain) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">No Pokemon data found</div>
      </div>
    );
  }

  const evolutions = getEvolutionChain(evolutionChain.chain);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        to="/" 
        className="inline-block mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
      >
        ← Back to List
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with name and image */}
        <div className="bg-gray-100 p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold capitalize">
              {pokemon.name} <span className="text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
            </h1>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start">
              {pokemon.types.map((type) => (
                <span 
                  key={type.type.name}
                  className="mr-2 mb-2 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: getTypeColor(type.type.name),
                    color: getTypeTextColor(type.type.name)
                  }}
                >
                  {type.type.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          <div className="w-48 h-48 relative">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">Pokemon Info</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">Height:</div>
                <div>{(pokemon.height / 10).toFixed(1)} m</div>
                <div className="text-gray-600">Weight:</div>
                <div>{(pokemon.weight / 10).toFixed(1)} kg</div>
                <div className="text-gray-600">Base Experience:</div>
                <div>{pokemon.base_experience}</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">Abilities</h2>
              <ul className="space-y-2">
                {pokemon.abilities.map((ability) => (
                  <li key={ability.ability.name} className="flex items-center">
                    <span className="capitalize">{ability.ability.name.replace('-', ' ')}</span>
                    {ability.is_hidden && (
                      <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">Hidden</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">Base Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{formatStatName(stat.stat.name)}</span>
                    <span className="font-bold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Evolution Chain */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">Evolution Chain</h2>
            {evolutions.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center">
                {evolutions.map((evolution, index) => (
                  <React.Fragment key={evolution.id}>
                    <Link to={`/pokemon/${evolution.id}`} className="flex flex-col items-center mx-2 my-2">
                      <div 
                        className={`w-24 h-24 flex items-center justify-center rounded-full p-2 ${parseInt(id) === parseInt(evolution.id) ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}
                      >
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
                          alt={evolution.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="mt-2 capitalize font-medium">{evolution.name}</span>
                    </Link>
                    {index < evolutions.length - 1 && (
                      <div className="mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p>No evolution data available</p>
            )}
          </div>
          
          {/* Moves */}
          <div>
            <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2">Moves</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {pokemon.moves.slice(0, 20).map((move) => (
                <div key={move.move.name} className="bg-gray-100 px-3 py-2 rounded capitalize text-sm">
                  {move.move.name.replace('-', ' ')}
                </div>
              ))}
              {pokemon.moves.length > 20 && (
                <div className="bg-gray-200 px-3 py-2 rounded text-sm flex items-center justify-center">
                  +{pokemon.moves.length - 20} more moves
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get color based on Pokemon type
function getTypeColor(type) {
  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };
  
  return typeColors[type] || '#777';
}

// Helper function to determine text color based on background
function getTypeTextColor(type) {
  const darkTypes = ['normal', 'electric', 'ground', 'fairy', 'ice', 'steel', 'bug'];
  return darkTypes.includes(type) ? '#333' : '#fff';
}