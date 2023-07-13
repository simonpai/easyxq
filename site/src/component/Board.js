import { useCallback } from 'react';
import { pids, colors, coordinates as c } from '@easyxq/sdk';
import Piece from './Piece';
import Mark from './Mark';
import { url } from './utils';

export default function Board({ mirror, state, selected, onMove, onSelect }) {
  const { game, queries } = state;
  const { index, position, result, lastPly } = game;
  const { nextPlies } = queries;
  const { color } = position;
  const pieces = [...position.board.pieces];
  const lastPlyPid = lastPly && lastPly.pid;

  const tsid = useCallback(sid => mirror ? c.mirror(sid) : sid, [mirror]);
  const tsq = useCallback(square => mirror ? { ...square, sid: c.mirror(square.sid) } : square, [mirror]);

  function handlePieceClick(event, { pid }) {
    if (result || pids.color(pid) !== color) {
      return;
    }
    event.stopPropagation();
    onSelect(selected === pid ? pids.EMPTY : pid);
  }
  function handleGridClick(event) {
    if (result) {
      return;
    }
    event.stopPropagation();
    onSelect(pids.EMPTY);
  }
  function handleMarkClick(event, ply) {
    if (result || ply.violation) {
      return;
    }
    event.stopPropagation();
    onMove(ply.color, index, ply);
  }

  // TODO: image path

  return (
    <div className={`chessboard ${colors.en(color)}`}>
      <div className={`chessboard__plate`} onClick={handleGridClick} onContextMenu={event => event.preventDefault()}>
        <div className={`chessboard__inner`}>
          <img className="chessboard__grid" src={url('img/grid.svg')} />
          {
            pieces.map(square =>
              <Piece
                key={square.pid}
                square={tsq(square)}
                selected={selected === square.pid}
                lastMoved={lastPlyPid === square.pid}
                onClick={event => handlePieceClick(event, square)}
              />
            )
          }
          {
            selected !== pids.EMPTY && nextPlies.filter(ply => ply.pid === selected).map(ply => 
              <Mark key={`next:${ply.to}`} type={ply.violation ? 'banned' : 'next'} sid={tsid(ply.to)} onClick={event => handleMarkClick(event, ply)} />
            )
          }
          {
            lastPly && <Mark key="last" type="last" sid={tsid(lastPly.from)} />
          }
        </div>
      </div>
    </div>
  );
}
