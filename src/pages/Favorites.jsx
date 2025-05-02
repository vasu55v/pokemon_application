import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import Header from "../components/Header";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const data = await Promise.all(
          favorites.map((id) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
              res.json()
            )
          )
        );
        setPokemonData(data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <Header />
      <h1 className="text-2xl font-bold text-black mb-4">Your Favorites</h1>
      {pokemonData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pokemonData.map((poke) => (
            <Link key={poke.id} to={`/pokemon/${poke.id}`}>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <img
                  src={
                    poke.sprites.other["official-artwork"].front_default ||
                    poke.sprites.front_default
                  }
                  alt={poke.name}
                  className="w-24 h-24 mx-auto"
                />
                <p className="mt-2 capitalize font-bold">{poke.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">You haven't added any favorites yet.</p>
      )}
    </div>
  );
}
