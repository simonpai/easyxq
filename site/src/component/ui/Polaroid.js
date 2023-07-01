import { asArray } from '@easyxq/commons';

export default function Polaroid({ children, ...props }) {
  const [photo, caption] = asArray(children);
  return (
    <div className="polaroid" style={getStyle(props)}>
      <div className="polaroid__photo">
        { photo }
      </div>
      <div className="polaroid__caption">
        { caption }
      </div>
    </div>
  );
}

function getStyle({ tilt, warpage } = {}) {
  const style = {};
  if (tilt) {
    style.transform = `rotate(${tilt}deg)`;
  }
  if (warpage) {
    // TODO
  }
  return style;
}
