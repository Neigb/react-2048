import Button from "../../Button";

export function OperatButtons(props) {
  const { game_state, restart, gameover } = props;
  const restart_button_props = {
    value: "重新开始",
    onClick: () => {
      console.log("重新开始");
      restart();
    },
  };

  const stop_button_props = {
    value: "结束",
    onClick: () => {
      console.log("结束");
      gameover();
    },
  };

  return (
    <div className="operat-buttons">
      <Button {...restart_button_props} disabled={game_state === "stared"} />
      <Button {...stop_button_props} disabled={game_state === "started"} />
    </div>
  );
}

export default OperatButtons;
