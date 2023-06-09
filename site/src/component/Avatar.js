import { url } from './utils.js';

export default function Avatar({ imageUrl, className } = {}) {

  const classNames = ['avatar'];
  className && classNames.push(className);

  return (
    <div className={classNames.join(' ')}>
      <div className="avatar__frame">
        <div className="avatar__inner">
          <img className="avatar__img" src={url(imageUrl)} />
        </div>
      </div>
    </div>
  );
}
