
import './App.css';
import NewHeader from './components/header/hewHeader';
import Footer from './components/footer/hooter';
import AllPokemons from './components/renderPokemons/allPokemons';

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
