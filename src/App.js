import './icons/iconfont.css';
import './App.css';
import Game from './Game';
import React, { useState } from 'react';


function App() {
  const game_ref = React.createRef();
  const [base_config, setConfig] = useState({
    row_num: 6,
    col_num: 4,
  });


  return (
    <div className="App game-background">
      <Game ref={game_ref} base_config={base_config} setConfig={setConfig}  />
    </div>
  );
}

export default App;
