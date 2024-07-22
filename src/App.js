import React from "react";
import AudienceChart from './components/AudienceChart';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Medidor de Audiência</h1>
      </header>
      <main>
        <AudienceChart />
      </main>
    </div>
  );
};

export default App;
