import './index.css';
import React, { useState } from 'react';
import ConfigDialog from './ConfigDialog';

export default function GameOverPanel(props) {
  console.log("GameOverPanel");
  console.log(props);
  const { score, start, restart, game_state, time, turns } = props;
  const { row_num, col_num } = props.base_config;
  const [ dialog_visible, setDialogVisible ] = useState(false);
  return (
    <div className="game-over-panel" style={{ display: game_state === 'stopped' ? 'flex' : 'none' }}>
      <div style={{ display: !dialog_visible?"block":"none"}}>
        <h1>游戏结束!!</h1>
        <h2 className="game-over-panel__score">你的得分: {score}</h2>
        <h4>最高得分: {score}</h4>
        <h4>行数: {row_num} 列数: {col_num}</h4>
        <h4>移动: {turns} 次</h4>
        <h4>耗时: {time} 秒</h4>
        <div className="game-over-panel__buttons mt10">
          <button className="game-over-panel__button button" onClick={restart}>重玩</button>
          <button className="game-over-panel__button button ml10" onClick={() => setDialogVisible(true)}>配置</button>
        </div>
      </div>
      <ConfigDialog visible={dialog_visible} base_config={props.base_config} sureClick={start} cancelClick={() => setDialogVisible(false)} />
    </div>
  );
}

