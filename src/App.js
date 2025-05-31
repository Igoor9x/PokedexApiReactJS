
import './App.css';
import { useState } from 'react';
import NewHeader from './components/Header/NewHeader';
import Footer from './components/footer/Footer';
import AllPokemons from './components/renderPokemons/AllPokemons';

function App() {
  return (
    <div className="App">
      <NewHeader /> 
      <AllPokemons />
      <Footer /> 
    </div>
  );
}

export default App;
