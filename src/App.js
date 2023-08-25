
import './App.css';
import { useState } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import AllPokemons from './Components/AllPokemons';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="App">
      <Header onSearch={setSearchQuery} /> 
      <AllPokemons  seachQuery={searchQuery}/>
      <Footer /> 
    </div>
  );
}

export default App;
