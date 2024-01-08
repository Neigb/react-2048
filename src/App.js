import './App.css';
import Game from './Game';
import React, { useState } from 'react';


function App() {
  const game_ref = React.createRef();
  const [base_config] = useState({
    row_num: 4,
    col_num: 6,
  });



  return (
    <div className="App game-background">
      <Game ref={game_ref} base_config={base_config}  />
    </div>
  );
}

export default App;
