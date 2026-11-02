import React, { useState, useEffect, useMemo } from 'react';
import Searchbar from '../Searchbar/Searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './AllPokemons.css';
import '../Types.css';
import pokeballCollor from '../../img/pokeballCollor.png';

const TOTAL_POKEMONS = 151;
const CACHE_KEY = `pokedex-gen1-v1-${TOTAL_POKEMONS}`;

const capitalize = (texto) => texto.replace(/^./, (letra) => letra.toUpperCase());

// Guarda só os campos que o app usa. A resposta completa da API de cada
// Pokémon é enorme, e isso deixa o cache pequeno o bastante para o localStorage.
const resumirPokemon = (p) => ({
  id: p.id,
  name: p.name,
  height: p.height,
  weight: p.weight,
  base_experience: p.base_experience,
  types: p.types.map((t) => t.type.name),
  artwork: p.sprites.other['official-artwork'].front_default,
  thumb: p.sprites.other['dream_world'].front_default || p.sprites.front_default,
  stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  abilities: p.abilities.map((a) => a.ability.name),
});

const lerCache = () => {
  try {
    const salvo = localStorage.getItem(CACHE_KEY);
    return salvo ? JSON.parse(salvo) : null;
  } catch {
    return null;
  }
};

const salvarCache = (lista) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(lista));
  } catch {
    // Sem espaço ou localStorage bloqueado: o app continua funcionando sem cache
  }
};

const buscarPokemons = async () => {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMONS}&offset=0`);
  if (!resposta.ok) throw new Error('Falha ao buscar a lista');
  const { results } = await resposta.json();

  const detalhes = await Promise.all(
    results.map(async (pokemon) => {
      const r = await fetch(pokemon.url);
      if (!r.ok) throw new Error(`Falha ao buscar ${pokemon.name}`);
      return resumirPokemon(await r.json());
    })
  );
  return detalhes;
};

function AllPokemons() {
  const [todosPokemons, setTodosPokemons] = useState(() => lerCache() || []);
  const [carregando, setCarregando] = useState(todosPokemons.length === 0);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [idEmDestaque, setIdEmDestaque] = useState(null);
  const [pokemonSelecionado, setPokemonSelecionado] = useState(null);

  // Busca na API UMA vez (ou nenhuma, se já estiver no cache).
  // Antes, cada busca refazia as 152 requisições.
  useEffect(() => {
    if (todosPokemons.length > 0) return;
    let ativo = true;
    setCarregando(true);
    setErro(false);
    buscarPokemons()
      .then((lista) => {
        if (!ativo) return;
        setTodosPokemons(lista);
        salvarCache(lista);
      })
      .catch(() => ativo && setErro(true))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [todosPokemons.length, tentativa]);

  // A busca agora só filtra a lista que já está em memória: é instantânea.
  const pokemons = useMemo(() => {
    const termo = searchQuery.toLowerCase();
    if (!termo) return todosPokemons;
    return todosPokemons.filter(
      (p) => p.name.includes(termo) || p.id.toString() === termo
    );
  }, [todosPokemons, searchQuery]);

  // Mostra o primeiro resultado em destaque até o usuário passar o mouse em outro
  const pokemonEmDestaque =
    pokemons.find((p) => p.id === idEmDestaque) || pokemons[0] || null;

  const fecharModal = () => setPokemonSelecionado(null);

  useEffect(() => {
    if (!pokemonSelecionado) return;
    const aoApertarTecla = (e) => e.key === 'Escape' && fecharModal();
    window.addEventListener('keydown', aoApertarTecla);
    return () => window.removeEventListener('keydown', aoApertarTecla);
  }, [pokemonSelecionado]);

  return (
    <div>
      <Searchbar onSearch={setSearchQuery} />
      <div className='containerPokemons'>
        <div className='containerLeft'>
          <img className='pokeballBackground' src={pokeballCollor} alt='' />

          {carregando && <p className='statusMessage'>Carregando Pokémons...</p>}

          {erro && (
            <div className='statusMessage'>
              <p>Não foi possível carregar os Pokémons.</p>
              <button type='button' onClick={() => setTentativa((t) => t + 1)}>
                Tentar de novo
              </button>
            </div>
          )}

          {!carregando && !erro && pokemons.length === 0 && (
            <p className='statusMessage'>Nenhum Pokémon encontrado para "{searchQuery}".</p>
          )}

          {pokemonEmDestaque && (
            <button
              type='button'
              className='pokemonSolo active'
              onClick={() => setPokemonSelecionado(pokemonEmDestaque)}
            >
              <h2>{capitalize(pokemonEmDestaque.name)}</h2>
              <span>No. {pokemonEmDestaque.id}</span>
              <img src={pokemonEmDestaque.artwork} alt={pokemonEmDestaque.name} />
              <div className='tipos'>
                {pokemonEmDestaque.types.map((tipo) => (
                  <span key={tipo} className={tipo}>{capitalize(tipo)}</span>
                ))}
              </div>
            </button>
          )}
        </div>

        <div className='containerRight'>
          <div className='listPokemons'>
            {pokemons.map((pokemon) => (
              <button
                type='button'
                key={pokemon.id}
                className='listItemButton'
                onMouseEnter={() => setIdEmDestaque(pokemon.id)}
                onFocus={() => setIdEmDestaque(pokemon.id)}
                onClick={() => setPokemonSelecionado(pokemon)}
              >
                <span className='cardPokemon'>
                  {capitalize(pokemon.name)}
                  <img
                    style={{ width: '60px', maxWidth: '60px' }}
                    src={pokemon.thumb}
                    alt=''
                    loading='lazy'
                  />
                  No. {pokemon.id}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {pokemonSelecionado && (
        <div className='modalDetails active' role='dialog' aria-modal='true' aria-label={`Details of ${pokemonSelecionado.name}`}>
          <div className='overlayModal' onClick={fecharModal}></div>
          <div className='modalDetailsContent'>
            <button type='button' className='closeModalBtn' onClick={fecharModal} aria-label='Close'>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3>Details</h3>
            <div className='generalDetails'>
              <h2>{capitalize(pokemonSelecionado.name)}</h2>
              <img src={pokemonSelecionado.artwork} alt={pokemonSelecionado.name} />
              <p><strong>Id:</strong> {pokemonSelecionado.id}</p>
              <p><strong>Height:</strong> {pokemonSelecionado.height / 10} m</p>
              <p><strong>Weight:</strong> {pokemonSelecionado.weight / 10} kg</p>
              <p><strong>Base Experience:</strong> {pokemonSelecionado.base_experience}</p>
            </div>
            <div className='stats'>
              <p><strong>Stats:</strong></p>
              <ul>
                {pokemonSelecionado.stats.map((stat) => (
                  <li key={stat.name}>
                    {capitalize(stat.name)}
                    <span className='statsValue'>{stat.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='abilities'>
              <p><strong>Abilities:</strong></p>
              <ul>
                {pokemonSelecionado.abilities.map((ability) => (
                  <li key={ability}>{capitalize(ability)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllPokemons;
