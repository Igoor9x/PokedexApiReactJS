import './App.css';
import NewHeader from './Components/header/NewHeader';
import Footer from './Components/Footer/Footer';
import AllPokemons from './Components/RenderPokemons/AllPokemons';

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
