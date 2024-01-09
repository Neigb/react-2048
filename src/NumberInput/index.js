import './index.css';

export default function NumerInput({
  value,
  onChange,
  label,
  labelWidth,
  style,
  min,
  max,
}) {
  const titleStyle = {
    width: labelWidth || "60px"
  };
  const Title = label ? <div style={{...titleStyle}} className="input_title">{label}</div> : null;
  const valueChange = (e) => {
    const value = Math.floor(Number(e));
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    } else {
      onChange(value);
    }
  }
  return (
    <div style={style} className="input w300">
      {Title}
      <input className="input_inner" type="number" value={Number(value)} onChange={(e) => valueChange(Number(e.target.value))} />
    </div>
  );
}