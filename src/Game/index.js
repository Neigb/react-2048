import React from "react";
import "./index.css";
import OperatButtons from "./OperatButtons";
import GameOverPanel from "./GameOverPanel";

// 初始化生成方块数量
const init_cell_num = 3;
const max_width = 600;
// 随机生成方块
function generate_one(cell_array) {
  if (!cell_array) return;
  const row = cell_array.length;
  const col = cell_array[0].length;
  const value = random();
  const row_index = Math.floor(Math.random() * row);
  const col_index = Math.floor(Math.random() * col);
  if (cell_array[row_index][col_index] === 0) {
    cell_array[row_index].splice(col_index, 1, value);
    return value;
  } else {
    return generate_one(cell_array);
  }
}

function generate(cell_array) {
  const values = [];
  for (let i = 0; i < init_cell_num; i++) {
    values.push(generate_one(cell_array));
  }
  return values;
}

//  随机生成一个2或4
function random() {
  return Math.random() > 0.7 ? 4 : 2;
}

function Row({ col_array }) {
  return (
    <div className="row">
      {col_array.map((value, col_index) => (
        <div key={col_index} className={"item flex-center color-" + value}>
          {value ? <span>{value}</span> : ""}
        </div>
      ))}
    </div>
  );
}

export default class Game extends React.Component {
  state = {
    game_state: "init", // init, started, stopped
    cell_array: [],
    init_gengerate_cells: [],
    score: 0,
  };
  touch_start_event = null;
  touch_end_event = null;

  initCellArray() {
    const cell_array = new Array(this.row)
      .fill(0)
      .map(() => new Array(this.col));
    cell_array.forEach((item) => item.fill(0));
    const init_gengerate_cells = generate(cell_array);
    this.setState({ init_gengerate_cells });
    return cell_array;
  }

  init(base_config) {
    const { row_num, col_num } = base_config;
    this.row = row_num;
    this.col = col_num;
    this.setState({
      game_state: "started",
      cell_array: this.initCellArray(),
      score: 0,
    });
    this.touch_start_event = this.touch_end_event = null;
  }

  componentDidMount() {
    this.init(this.props.base_config);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const keyCode = event.keyCode;
    switch (keyCode) {
      case 37:
        this.moveAction("left");
        break;
      case 38:
        this.moveAction("up");
        break;
      case 39:
        this.moveAction("right");
        break;
      case 40:
        this.moveAction("down");
        break;
      default:
        break;
    }
  };

  // 触摸开始
  touchStart(event) {
    this.touch_start_event = event;
  }

  restart() {
    this.init(this.props.base_config);
  }

  gameover() {
    this.setState({ game_state: "stopped" });
  }

  // 触摸结束
  touchEnd(event) {
    this.touch_end_event = event;
    this.handleTouch();
  }

  touchCancel(event) {
    this.touch_start_event = this.touch_end_event = null;
  }

  handleTouch() {
    if (!this.touch_start_event || !this.touch_end_event) return;
    const start_native_event = this.touch_start_event.nativeEvent;
    const end_native_event = this.touch_end_event.nativeEvent;
    if (
      start_native_event instanceof MouseEvent &&
      end_native_event instanceof MouseEvent
    ) {
      const start_x = start_native_event.clientX;
      const start_y = start_native_event.clientY;
      const end_x = end_native_event.clientX;
      const end_y = end_native_event.clientY;
      this.handleMove(start_x, start_y, end_x, end_y);
    } else if (
      start_native_event instanceof TouchEvent &&
      end_native_event instanceof TouchEvent
    ) {
      const start_x = start_native_event.changedTouches[0].clientX;
      const start_y = start_native_event.changedTouches[0].clientY;
      const end_x = end_native_event.changedTouches[0].clientX;
      const end_y = end_native_event.changedTouches[0].clientY;
      this.handleMove(start_x, start_y, end_x, end_y);
    }
    this.touch_start_event = this.touch_end_event = null;
  }

  handleMove(start_x, start_y, end_x, end_y) {
    const direction = this.pendingDirection(start_x, start_y, end_x, end_y);
    switch (direction) {
      case "left":
        this.moveAction("left");
        break;
      case "right":
        this.moveAction("right");
        break;
      case "up":
        this.moveAction("up");
        break;
      case "down":
        this.moveAction("down");
        break;
      default:
        this.touchCancel();
    }
  }

  pendingDirection(start_x, start_y, end_x, end_y) {
    const x = end_x - start_x;
    const y = end_y - start_y;
    if (Math.abs(x) < 30 && Math.abs(y) < 30) return "cancel";
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) {
        return "right";
      } else {
        return "left";
      }
    } else {
      if (y > 0) {
        return "down";
      } else {
        return "up";
      }
    }
  }

  transposeMatrix(matrix) {
    if (
      !Array.isArray(matrix) ||
      matrix.length === 0 ||
      !Array.isArray(matrix[0])
    ) {
      throw new Error("Invalid matrix");
    }
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  mergeLeftMoveResult(cell_array) {
    const new_cell_array = structuredClone(cell_array);
    const col = new_cell_array[0].length;
    new_cell_array.forEach((row, row_index) => {
      let mergeTotal = 0;
      while (mergeTotal++ < col - 1) {
        let zeroTotal = 0;
        for (let i = 0; i < col - zeroTotal; ) {
          if (row[i] === 0) {
            zeroTotal++;
            row.splice(i, 1);
            row.push(0);
          } else if (row[i + 1] === row[i]) {
            row[i] *= 2;
            row[i + 1] = 0;
            i++;
          } else {
            i++;
          }
          if (zeroTotal === col) {
            break;
          }
        }
      }
    });
    return new_cell_array;
  }

  pendingGameOver() {
    const { row, col } = this;
    const cell_array = this.state.cell_array;
    for (let i = 0; i < row - 1; i++) {
      for (let j = 0; j < col - 1; j++) {
        if (cell_array[i][j] === cell_array[i][j + 1]) return false;
        if (cell_array[i][j] === cell_array[i + 1][j]) return false;
      }
    }
    return true;
  }

  moveAction(direction) {
    let cell_array;
    switch (direction) {
      case "left":
        cell_array = this.getMoveLeftResult();
        break;
      case "right":
        cell_array = this.getMoveRightResult();
        break;
      case "up":
        cell_array = this.getMoveUpResult();
        break;
      case "down":
        cell_array = this.getMoveDownResult();
        break;
      default:
        this.touchCancel();
        return;
    }
    const origin_cell_array = this.state.cell_array;
    if (this.arraysAreEqual(origin_cell_array.flat(), cell_array.flat())) {
    } else {
      generate_one(cell_array);
      const score =
        cell_array.flat().reduce((total, item) => total + item, 0) -
        this.state.init_gengerate_cells.reduce(
          (total, item) => total + item,
          0
        );
      this.setState({ cell_array, score });
    }
    if (this.pendingGameOver(cell_array)) {
      this.setState({ game_state: "stopped" });
    }
  }

  arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
  }

  // 向左移动
  getMoveLeftResult() {
    let cell_array = this.state.cell_array;
    return this.mergeLeftMoveResult(cell_array);
  }

  // 向右移动
  getMoveRightResult() {
    let cell_array = this.state.cell_array;
    return this.mergeLeftMoveResult(
      cell_array.map((row) => row.toReversed())
    ).map((row) => row.toReversed());
  }

  // 向上移动
  getMoveUpResult() {
    let cell_array = this.transposeMatrix(
      structuredClone(this.state.cell_array)
    );
    return this.transposeMatrix(this.mergeLeftMoveResult(cell_array));
  }

  // 向下移动
  getMoveDownResult() {
    let cell_array = this.transposeMatrix(
      structuredClone(this.state.cell_array)
    ).map((row) => row.reverse());
    return this.transposeMatrix(
      this.mergeLeftMoveResult(cell_array).map((row) => row.reverse())
    );
  }

  turnLeft() {
    const cell_array = this.transposeMatrix(
      structuredClone(this.state.cell_array)
    ).reverse();
    this.setState({ cell_array });
  }

  turnRight() {
    const cell_array = this.transposeMatrix(
      structuredClone(this.state.cell_array)
    ).map((row) => row.reverse());
    this.setState({ cell_array });
  }

  render() {
    const { game_state, score } = this.state;
    const isGameOver = game_state === "stopped";
    if (game_state === "init") return <div>loading</div>;
    return (
      <>
        <div className="container-wrap" style={{ maxWidth: max_width + "px" }}>
          <div className={ isGameOver ? "blur5" : "" }>
            <p className="mb10 tal fz20">Score: {score}</p>
            <div
              onMouseDown={this.touchStart.bind(this)}
              onMouseUp={this.touchEnd.bind(this)}
              onTouchStart={this.touchStart.bind(this)}
              onTouchEnd={this.touchEnd.bind(this)}
              onTouchCancel={this.touchCancel.bind(this)}
              className="container flex-center"
              style={{
                margin: "0 auto",
                fontSize: max_width / (this.col * 2) + "px",
              }}
            >
              {this.state.cell_array.map((col_array, row_index) => (
                <Row key={row_index} row_index={row_index} col_array={col_array} />
              ))}
            </div>
            <OperatButtons
              {...this.props}
              {...this.state}
              restart={this.restart.bind(this)}
              gameover={this.gameover.bind(this)}
              turnLeft={this.turnLeft.bind(this)}
              turnRight={this.turnRight.bind(this)}
            />

          </div>
          <GameOverPanel {...this.props} {...this.state} />
        </div>
      </>
    );
  }
}
