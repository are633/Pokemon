import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import PokemonCard from "./PokemonCard";
import DatosPokemon from "./DatosPokemon";

const Pokedex = () => {
  const [listaPokemons, setListaPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 20;
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * pokemonsPerPage;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${pokemonsPerPage}`
        );
        const data = await response.json();

        const newPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return response.json();
          })
        );

        setListaPokemons((prevPokemons) => [...prevPokemons, ...newPokemons]);
      } catch (error) {
        Swal.fire("Error", "No se pudo conectar al API", "error");
        console.error(error);
      }
      setLoading(false);
    };

    loadPokemons();
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight &&
        !loading
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    containerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <div ref={containerRef} style={{ overflowY: "auto", height: "1000px" }}>
      <section className="col-sm-12 col-lg-8 d-flex justify-content-center flex-wrap z-1 mt-5">
        {listaPokemons.map((pokemon, index) => (
          <PokemonCard key={index} pokemon={pokemon} onSelect={handlePokemonSelect} />
        ))}
        <DatosPokemon pokemon={selectedPokemon} />
      </section>
    </div>
  );
};

export default Pokedex;
