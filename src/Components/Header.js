import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import "./Header.css";

function Header({onSearch}){

  const [termoBusca, setTermoBusca] = useState("");

  const handleInputChange = (event) => {
    setTermoBusca(event.target.value);
  };

  const handleSearch = () => {
    onSearch(termoBusca);
  };

  return(
    <div className='containerHeader'>
      <header>
        <div className='headerLeft'>
          <h1>Pokédex</h1>
        </div> 
        <div className='headerRight'>
          <input
           type='text'
           value={termoBusca}
           onChange={handleInputChange}
          />
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div> 
      </header>
    </div>
  );
}
export default Header