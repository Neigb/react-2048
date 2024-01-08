import './index.css';

export default function GameOverPanel(props) {
  const { score, restart, game_state } = props;
  return (
    <div className="game-over-panel" style={{ display: game_state === 'stopped' ? 'block' : 'none' }}>
      <div className="game-over-panel__score">Score: {score}</div>
      <div className="game-over-panel__restart" onClick={restart}>
        Restart
      </div>
    </div>
  );
}