import './App.css';
import Game from './Game';
import Button from './Button';
import React, { useState } from 'react';


function App() {
  const game_ref = React.createRef();
  const [base_config, setConfig] = useState({
    row_num: 4,
    col_num: 4,
  });

  const start_button_props = {
    value: '重新开始',
    onClick: () => {
      console.log('重新开始');
      const new_config = {...base_config};
      setConfig(new_config);
      game_ref.current.reStart(new_config);
    }
  }

  return (
    <div className="App game-background">
      <Game ref={game_ref} base_config={base_config}  />
      <Button className="mt10" {...start_button_props} />
    </div>
  );
}

export default App;
