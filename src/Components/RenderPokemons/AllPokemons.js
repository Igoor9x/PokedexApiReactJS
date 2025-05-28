import React, { useState, useEffect } from 'react';
import Searchbar from '../searchbar/Searchbar';
import './AllPokemons.css';
import '../Types.css';
import pokeballCollor from '../../img/pokeballCollor.png';

function AllPokemons() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [pokemons, setPokemons] = useState([]);
  const [cardPokemon, setCardPokemon] = useState(null);
  const [pokemonSelecionado, setPokemonSelecionado] = useState(null);

const handleCardPokemon = (pokemon) => {
  setPokemonSelecionado(pokemon);
}

  const handleMouseEnter = (index) => {
    setCardPokemon(index);
  }

  const pegarListaPokemon = async () => {
    const urlAPI = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';
    const responseAPI = await fetch(urlAPI);
    const dbPokemons = await responseAPI.json();

    const dbListPokemon = await Promise.all(
      dbPokemons.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
        
      })
    );
    return dbListPokemon;
  };

  useEffect(() => {
    const mostrarListaPokemon = async () => {
      const dbListPokemon = await pegarListaPokemon();
      const filteredPokemons = dbListPokemon.filter(
        pokemon =>
          pokemon.name.includes(searchQuery.toLowerCase()) ||
          pokemon.id.toString() === searchQuery
      );
      setPokemons(filteredPokemons);
    };
    mostrarListaPokemon();
  }, [searchQuery]);

  useEffect(() => {
  if (pokemonSelecionado) {
    const modalDetails = document.querySelector('.modalDetails');
    if (modalDetails) {
      modalDetails.classList.add('active');
    }
  }
}, [pokemonSelecionado]);
  
  return (
    <div>
      <Searchbar onSearch={setSearchQuery} />
      <div className='containerPokemons'>
        <div
          className='containerLeft' >
            <img className='pokeballBackground'src={pokeballCollor} alt='pokeball logo' />
          {pokemons.map((pokemon, index) => (
            <div key={index} className={`pokemonSolo ${cardPokemon === index ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleCardPokemon(pokemon)}
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
              {pokemonSelecionado && (
                <div className='modalDetails'>
                  <div className='overlayModal'></div>
                  <div className='modalDetailsContent'>
                     <span onClick={() => document.querySelector('.modalDetails').classList.remove('active')}>Fechar</span>
                    <h3>Details</h3>  
                    <p><strong>Height:</strong> {pokemon.height / 10} m</p>
                    <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                    <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
                    <p><strong>Abilities:</strong></p>
                    <ul>
                      {pokemon.abilities.map((ability, idx) => (
                        <li key={idx}>{ability.ability.name.replace(/^./, (str) => str.toUpperCase())}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>


        <div className='containerRight'>
         <div className='listPokemons'>
         {pokemons.map((pokemon, index) => (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
             > 
              <span className='cardPokemon' >
                {pokemon.name.replace(/^./, (str) => str.toUpperCase())}
                <img 
                style={{width:'60px', maxWidth:'60px'}}
                src={pokemon.sprites.other['dream_world'].front_default}
                alt={pokemon.name}
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

