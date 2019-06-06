import React from "react";
import { Game } from "./Game";

const App: React.FC = props => {
  return (
    <div className="App">
      <Game search="Nicolas Cage" limit={10} />
    </div>
  );
};

export default App;
