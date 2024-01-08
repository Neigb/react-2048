import './index.css';

export function Button(props) {
  const className = (props.className || '') + ' button';
  return <button className={className} onClick={props.onClick}>{props.value}</button>;
}
export default Button;
