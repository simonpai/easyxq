import { Frame } from './ui/index.js';
import { url } from './utils.js';

export default function Avatar({ imageUrl, className } = {}) {
  const classNames = ['avatar'];
  className && classNames.push(className);
  return (
    <div className={classNames.join(' ')}>
      <Frame>
        <img className="avatar__img" src={url(imageUrl)} />
      </Frame>
    </div>
  );
}
