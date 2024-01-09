import Button from "../../Button";

export function OperatButtons(props) {
  const { game_state, gameover, turnLeft, turnRight } = props;
  // const restart_button_props = {
  //   value: "重新开始",
  //   onClick: () => {
  //     console.log("重新开始");
  //     restart();
  //   },
  // };

  const stop_button_props = {
    value: "结束",
    onClick: () => {
      console.log("结束");
      gameover();
    },
  };

  const turn_left_button_props = {
    value: "左转",
    icon: "icon-turn_left",
    onClick: () => {
      console.log("左转");
      turnLeft();
    },
  };

  const turn_right_button_props = {
    value: "右转",
    icon: "icon-turn_right",
    onClick: () => {
      console.log("右转");
      turnRight();
    },
  };

  return (
    <div className="operat-buttons mt10">
      <Button className="mw100 mr10" {...turn_left_button_props} disabled={game_state === "stopped"} />
      <Button className="mw100 mr10" {...turn_right_button_props} disabled={game_state === "stopped"} />
      {/* <Button className="mw100 mr10" {...restart_button_props} disabled={game_state === "stared"} /> */}
      <Button className="mw100" {...stop_button_props} disabled={game_state === "started"} />
    </div>
  );
}

export default OperatButtons;
