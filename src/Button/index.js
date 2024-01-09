import './index.css';

export function Button(props) {
  let className = (props.className || '') + ' button';
  const icon = props.icon ? <i className={'iconfont mr5 ' + props.icon}></i> : '';
  const value = props.value ? <span>{props.value}</span> : '';
  const onClick = props.onClick || (() => { });
  if (props.disabled) {
    className += ' disabled';
  }
  return <div className={className} onClick={onClick}>{icon}{value}</div>
}
export default Button;
