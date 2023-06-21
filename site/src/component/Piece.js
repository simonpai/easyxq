import { pids, pieces } from '@easyxq/sdk';
import { getSidCssProperties } from './utils.js';
import Char from './util/Char.js';

function getColor(pid, piece) {
  if (pid !== undefined) {
    return pids.isRed(pid) ? 'red' : 'black';
  }
  if (piece !== undefined) {
    return pieces.isRed(piece) ? 'red' : 'black';
  }
  return undefined;
}

export default function Piece({ square, pid, piece, children = [], selected = false, lastMoved = false, className, onClick = () => {} }) {
  const sid = square ? square.sid : undefined;
  pid = square ? square.pid : pid;
  const color = getColor(pid, piece);

  const style = sid !== undefined ? getSidCssProperties(sid) : {};

  const classNames = ['piece'];
  color && classNames.push(color);
  lastMoved && classNames.push('last-moved');
  selected && classNames.push('selected');
  className && classNames.push(className);

  return (
    <div className={classNames.join(' ')} style={style} onClick={onClick}>
      <div className="piece__inner">
        {
          (pid !== undefined || piece !== undefined) && <Char className="piece--char circled" pid={pid} piece={piece} />
        }
        {
          children
        }
      </div>
    </div>
  );
}
