import React, { useState } from 'react';
import NumerInput from '../../../NumberInput';

export default function ConfigDialog(props) {
  const { visible, sureClick, cancelClick, base_config } = props;
  const [ row_num, setRowNum ] = useState(base_config.row_num);
  const [ col_num, setColNum ] = useState(base_config.col_num);
  const min = 4, max = 10;
  return (
    <div className="config-dialog" style={{ display: visible ? "block":"none"}}>
      <h2 className="mb10">游戏配置</h2>
      <div className="config-dialog__content">
        <div className="config-dialog__row">
          <NumerInput value={row_num} onChange={(value) => setRowNum(value)} label="行数" min={min} max={max} />
        </div>
        <div className="config-dialog__row mt10">
          <NumerInput value={col_num} onChange={(value) => setColNum(value)} label="列数" min={min} max={max} />
        </div>
      </div>
      <div className="config-dialog__buttons mt10">
        <button className="config-dialog__button button" onClick={ () => sureClick({ row_num, col_num })}>开始</button>
        <button className="config-dialog__button button ml10" onClick={cancelClick}>取消</button>
      </div>
    </div>
  );
}
