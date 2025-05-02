import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import SortingComponent from '../components/SortingComponent';
import PokemonComparison from '../components/PokemonComparison';
import PaginationComponent from '../components/PaginationComponent';
import LoadingState from "../components/LoadingState";

const PokemonExplorer = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonData = await Promise.all(
          res.data.results.map(async (p) => {
            const details = await axios.get(p.url);
            return details.data;
          })
        );
        setPokemonList(pokemonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    const fetchTypes = async () => {
      try {
        const res = await axios.get('https://pokeapi.co/api/v2/type');
        setTypes(res.data.results.map(t => t.name));
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchPokemon();
    fetchTypes();
  }, []);

  useEffect(() => {
    let updatedList = [...pokemonList];

    // Filter by type
    if (selectedType) {
      updatedList = updatedList.filter(p =>
        p.types.some(t => t.type.name === selectedType)
      );
    }

    // Filter by search
    if (searchQuery) {
      updatedList = updatedList.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortOrder === 'id-asc') {
      updatedList.sort((a, b) => a.id - b.id);
    } else if (sortOrder === 'id-desc') {
      updatedList.sort((a, b) => b.id - a.id);
    } else if (sortOrder === 'name-asc') {
      updatedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      updatedList.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredPokemonList(updatedList);
    setCurrentPage(1); // Reset page when filters change
  }, [pokemonList, selectedType, searchQuery, sortOrder]);

  const toggleFavorite = (id) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleCompare = (pokemon) => {
    setCompareList((prev) => {
      if (prev.some(p => p.id === pokemon.id)) {
        return prev.filter(p => p.id !== pokemon.id);
      } else if (prev.length < 2) {
        return [...prev, pokemon];
      } else {
        return prev;
      }
    });
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    setFilteredPokemonList([randomPokemon]);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPokemonList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemon = filteredPokemonList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Pokémon Explorer</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Pokémon"
          className="border rounded p-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border rounded p-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <SortingComponent sortOrder={sortOrder} setSortOrder={setSortOrder} />

        <button
          onClick={handleRandom}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Random Pokémon
        </button>
      </div>

      {compareList.length === 2 && (
        <PokemonComparison compareList={compareList} />
      )}
     {loading ? (
          <LoadingState />
        ) : filteredPokemonList.length === 0 ? (
        <div className="text-center text-xl mt-10">No Pokémon found.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedPokemon.map((pokemon) => (
              <>
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isFavorite={favorites.includes(pokemon.id)}
                toggleFavorite={toggleFavorite}
                handleCompare={handleCompare}
                isCompared={compareList.some(p => p.id === pokemon.id)}
              />
              </>
            ))}

          </div>
          
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
        )}
    </div>
  );
};

export default PokemonExplorer;
