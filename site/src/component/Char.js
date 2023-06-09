import { pids, pieces } from '@easyxq/sdk';
import SvgSprite from './SvgSprite.js';

export default function Char({ pid, piece, stroke = 'currentColor', strokeWidth = '3.5%', ...props }) {
  const id = pid !== undefined ? pids.format(pid) : pieces.format(piece);
  return (
    <SvgSprite file="pieces" id={id} data-char={id} stroke={stroke} strokeWidth={strokeWidth} {...props} />
  );
}
