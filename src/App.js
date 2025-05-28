
import './App.css';
import { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AllPokemons from './components/RenderPokemons/AllPokemons';

function App() {
  return (
    <div className="App">
      <Header /> 
      <AllPokemons />
      <Footer /> 
    </div>
  );
}

export default App;
