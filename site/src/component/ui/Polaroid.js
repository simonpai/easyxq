import { asArray } from '@easyxq/commons';

export default function Polaroid({ children, className = '', caption = true, tilt, warpage, ...props }) {
  const [photo, captionContent] = asArray(children);
  return (
    <div className={`polaroid ${className}`} style={getStyle({ tilt, warpage })} {...props}>
      <div className="polaroid__photo">
        { photo }
      </div>
      {
        caption && (
          <div className="polaroid__caption">
            { captionContent }
          </div>
        )
      }
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
