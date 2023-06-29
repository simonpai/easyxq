import { asArray } from '@easyxq/commons';

export default function Polaroid({ children }) {
  const [photo, caption] = asArray(children);
  return (
    <div className="polaroid">
      <div className="polaroid__photo">
        { photo }
      </div>
      <div className="polaroid__caption">
        { caption }
      </div>
    </div>
  );
}
