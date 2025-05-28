import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './Searchbar.css';

function Searchbar({ onSearch }) {

  const [termoBusca, setTermoBusca] = useState("");
  const handleSearch = () => {
    onSearch(termoBusca);
  };

  return (
    <div className='searchbar-Container'>
        <div className='searchbar'>
          <input
            type='text'
            placeholder='Search pokemon by name or number'
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <button onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
    </div>
  )
}

export default Searchbar;