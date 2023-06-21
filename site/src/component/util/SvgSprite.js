import { url } from '../utils.js';

export default function SvgSprite({ file, id, fill = 'currentColor', ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" fill={fill} {...props}>
      <use xlinkHref={url(`img/${file}.svg#${id}`)} />
    </svg>
  );
}
