import { getSidCssProperties } from './utils.js';

export default function Mark({ sid, type, onClick }) {
  const style = getSidCssProperties(sid);

  return (
    <div className={`mark ${type}`} style={style} onClick={onClick}></div>
  );
}
