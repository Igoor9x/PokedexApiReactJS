import React, { useState, useEffect } from 'react';
import './AllPokemons.css';
import './Types.css';
import pokeballCollor from '../img/pokeballCollor.png';

function AllPokemons({ seachQuery }) {
  const [pokemons, setPokemons] = useState([]);
  const [cardPokemon, setCardPokemon] = useState(null);

  const handleMouseEnter = (index) => {
    setCardPokemon(index);
  }

  const pegarListaPokemon = async () => {
    const urlAPI = 'https://pokeapi.co/api/v2/pokemon?limit=386&offset=0';
    const responseAPI = await fetch(urlAPI);
    const dbPokemons = await responseAPI.json();

    const dbListPokemon = await Promise.all(
      dbPokemons.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
      })
    );
    return dbListPokemon;
  }

  useEffect(() => {
    const mostrarListaPokemon = async () => {
      const dbListPokemon = await pegarListaPokemon();
      const filteredPokemons = dbListPokemon.filter(
        pokemon =>
          pokemon.name.includes(seachQuery.toLowerCase()) ||
          pokemon.id.toString() === seachQuery
      );
      setPokemons(filteredPokemons);
    };
    mostrarListaPokemon();
  }, [seachQuery]);
  
  return (
    <div>
      <div className='containerPokemons'>
        <div
          className='containerLeft'>
            <img className='pokeballBackground'src={pokeballCollor} />
          {pokemons.map((pokemon, index) => (
            <div key={index} className={`pokemonSolo ${cardPokemon === index ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            // onMouseLeave={handleMouseLeave}
            >
              <h2>{pokemon.name.replace(/^./, (str) => str.toUpperCase())}</h2>
              <span>No. {pokemon.id}</span>
              <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
              <div className='tipos'>
                <span className={pokemon.types[0].type.name}>
                  {pokemon.types[0].type.name.replace(/^./, (str) => str.toUpperCase())}
                </span>
                {pokemon.types[1] &&
                  <span className={pokemon.types[1].type.name}>
                    {pokemon.types[1].type.name.replace(/^./, (str) => str.toUpperCase())}
                  </span>}
              </div>
            </div>
          ))}
        </div>
        <div className='containerRight'>
         <div className='listPokemons'>
         {pokemons.map((pokemon, index) => (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              // onMouseLeave={handleMouseLeave}
             > 
              <span className='cardPokemonRight'>
                {pokemon.name.replace(/^./, (str) => str.toUpperCase())}
                <img 
                style={{width:'80px'}}
                src={pokemon.sprites.other['dream_world'].front_default}
                 />
                  No. {pokemon.id}
              </span>
            </div>
          ))}
         </div>
        </div>
      </div>
    </div>
  )
}

export default AllPokemons;

