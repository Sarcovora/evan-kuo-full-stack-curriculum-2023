import logo from './logo.svg';
import './App.css';
import Greeting from './Greeting'

function App() {

  let name = "TPEO!"

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello {}!</p>
        Learn React
      </header>
    </div>
  );
}

export default App;
