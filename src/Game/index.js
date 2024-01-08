import React from "react";
import "./index.css";

// 初始化生成方块数量
const init_cell_num = 3;

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
  } else {
    generate_one(cell_array);
  }
}

function generate(cell_array) {
  for (let i = 0; i < init_cell_num; i++) {
    generate_one(cell_array);
  }
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
  };
  touch_start_event = null;
  touch_end_event = null;

  initCellArray() {
    const cell_array = new Array(this.row)
      .fill(0)
      .map(() => new Array(this.col));
    cell_array.forEach((item) => item.fill(0));
    generate(cell_array);
    return cell_array;
  }

  init(base_config) {
    const { row_num, col_num } = base_config;
    this.row = row_num;
    this.col = col_num;
    this.setState({
      game_state: "started",
      cell_array: this.initCellArray(),
    });
    this.touch_start_event = this.touch_end_event = null;
  }

  componentDidMount() {
    this.init(this.props.base_config);
  }

  // 触摸开始
  touchStart(event) {
    this.touch_start_event = event;
  }

  reStart(base_config) {
    console.log("restart");
    this.init(base_config);
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

  turnLeft(cell_array) {
    const new_cell_array = cell_array
      .map((row, row_index) => {
        return row.map((col, col_index) => {
          return cell_array[col_index][row_index];
        });
      })
      .reverse();
    return new_cell_array;
  }

  turnRight(cell_array) {
    const new_cell_array = cell_array.map((row, row_index) => {
      return row
        .map((col, col_index) => {
          return cell_array[col_index][row_index];
        })
        .reverse();
    });
    return new_cell_array;
  }

  mergeLeftMoveResult(cell_array) {
    const new_cell_array = structuredClone(cell_array);
    new_cell_array.forEach((row, row_index) => {
      let mergeTotal = 0;
      while (mergeTotal++ < this.col - 1) {
        let zeroTotal = 0;
        for (let i = 0; i < this.col - zeroTotal; ) {
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
          if (zeroTotal === this.col) {
            break;
          }
        }
      }
    });
    return new_cell_array;
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
      console.log(direction, "是无效移动");
    } else {
      generate_one(cell_array);
      this.setState({ cell_array });
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
    let cell_array = structuredClone(this.state.cell_array);
    return this.turnRight(this.mergeLeftMoveResult(this.turnLeft(cell_array)));
  }

  // 向下移动
  getMoveDownResult() {
    let cell_array = structuredClone(this.state.cell_array);
    return this.turnLeft(this.mergeLeftMoveResult(this.turnRight(cell_array)));
  }

  render() {
    if (!this.state.game_state === "init") return <div>游戏未开始</div>;
    return (
      <div
        onMouseDown={this.touchStart.bind(this)}
        onMouseUp={this.touchEnd.bind(this)}
        onTouchStart={this.touchStart.bind(this)}
        onTouchEnd={this.touchEnd.bind(this)}
        onTouchCancel={this.touchCancel.bind(this)}
        className="container flex-center"
        style={{ margin: "0 auto", marginTop: "10vh" }}
      >
        {this.state.cell_array.map((col_array, row_index) => (
          <Row key={row_index} row_index={row_index} col_array={col_array} />
        ))}
      </div>
    );
  }
}
