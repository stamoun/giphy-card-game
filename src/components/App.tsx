import React from "react";
import { GamePanel } from "./GamePanel";

const App: React.FC = props => {
  return (
    <div className="App">
      <GamePanel search="Nicolas Cage" limit={10} />
    </div>
  );
};

export default App;
