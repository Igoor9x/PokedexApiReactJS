import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './Searchbar.css';

function Searchbar({ onSearch }) {
  const [termoBusca, setTermoBusca] = useState('');

  // Usar um <form> faz a busca funcionar tanto no clique da lupa quanto no Enter
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(termoBusca.trim());
  };

  return (
    <div className='searchbar-Container'>
      <form className='searchbar' onSubmit={handleSubmit} role='search'>
        <input
          type='text'
          placeholder='Search pokemon by name or number'
          aria-label='Search pokemon by name or number'
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button type='submit' aria-label='Search'>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
    </div>
  );
}

export default Searchbar;
