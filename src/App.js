
import './App.css';
import { useState } from 'react';
import Header from './components/header/NewHeader';
import Footer from './components/footer/Footer';
import AllPokemons from './components/renderPokemons/AllPokemons';

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
