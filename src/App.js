import React from "react";
import AudienceChart from './components/AudienceChart';
import './App.css';
import logo from "./img/logo.png";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
       <img src={logo} alt="logo" className="App-logo" ></img>
        <h1>Medidor de Audiência</h1>
      </header>
      <main>
        <AudienceChart />
        
      </main>
    </div>
  );
};

export default App;
