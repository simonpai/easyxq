import { pids, pieces, coordinates as c } from '../../constant/index.js';

export function cloneArray(array) {
  return Int8Array.from(array);
}

export function format(board) {
  const lines = []
  for (let rank = 9; rank >= 0; rank--) {
    let line = '';
    let empties = 0;
    let index = rank << 4;

    function flush() {
      if (empties) {
        line += `${empties}`;
        empties = 0;
      }
    }

    for (let file = 0; file < 9; file++) {
      const pid = board.at(index);
      if (pids.isEmpty(pid)) {
        empties++;
      } else {
        flush();
        line += pids.format(pid);
      }
      index++;
    }

    flush();
    lines.push(line);
  }
  return lines.join('/');
}

function initArray() {
  const array = new Int8Array(c.BOARD_ARRAY_SIZE); // use 16 slots per rank for easier index calculation
  array.fill(pids.EMPTY);
  return array;
}

export function fromSquares(squares) {
  const array = initArray();
  for (const { sid, pid } of squares) {
    array.fill(pid, sid, sid + 1);
  }
  return array;
}

export function parse(notation) {
  const array = initArray();

  function unrecognizedChar(i) {
    throw new Error(`Unrecognized character "${notation.charAt(i)}" in FEN at index ${i}.`);
  }
  function incorrectNumOfCells(rank) {
    throw new Error(`Invalid FEN: incorrect number of cells in rank ${rank + 1}.`);
  }
  function incorrectNumOfRanks() {
    throw new Error(`Invalid FEN: incorrect number of ranks.`);
  }

  const pids = pieces.pids();
  let rank = 9, file = 0;

  for (let i = 0, start = rank << 4, len = notation.length; i < len; i++) {
    const ch = notation.charCodeAt(i);
    if (ch > 64) {
      if (ch > 122 || (ch > 90 && ch < 97)) {
        unrecognizedChar(i);
      }
      // a piece
      file++;
      if (file > 9) {
        incorrectNumOfCells(rank);
      }
      const end = start + 1;
      array.fill(pids.get(pieces.decode(ch)), start, end);
      start = end;

    } else if (ch > 48 && ch < 58) { // '1' to '9'
      if (ch > 57) {
        unrecognizedChar(i);
      }
      const num = ch & 0xf;
      file += num;
      if (file > 9) {
        incorrectNumOfCells(rank);
      }
      const end = start + num;
      start = end;

    } else if (ch === 47) { // '/'
      if (file !== 9) {
        incorrectNumOfCells(rank);
      }
      rank--;
      file = 0;
      start = rank << 4;
      if (rank < 0) {
        incorrectNumOfRanks();
      }
    }
  }

  // at the end of string we should reach rank = 0 and file = 9
  if (rank !== 0) {
    incorrectNumOfRanks();
  }
  if (file !== 9) {
    incorrectNumOfCells(rank);
  }

  return array;
}
