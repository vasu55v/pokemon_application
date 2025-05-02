export default function FavoritesView({ favorites, pokemon }) {
    const favoritePokemon = pokemon.filter((p) => favorites.includes(p.id));
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Favorite Pokémon</h2>
        {favoritePokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoritePokemon.map((poke) => (
              <PokemonCard
                key={poke.id}
                pokemon={poke}
                isFavorite={favorites.includes(poke.id)}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't added any favorites yet.</p>
        )}
      </div>
    );
  }
  