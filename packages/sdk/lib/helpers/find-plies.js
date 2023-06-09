import { pids, COLOR, coordinates as c } from '../constant/index.js';
import Ply from '../model/ply.js';
import Square from '../model/square.js';
import { any } from './utils.js';

const YIELD_FNS = [
  findRedAdvisorPlies,
  findRedAdvisorPlies,
  findRedElephantPlies,
  findRedElephantPlies,
  findRedHorsePlies,
  findRedHorsePlies,
  findRedRookPlies,
  findRedRookPlies,
  findRedCannonPlies,
  findRedCannonPlies,
  findRedKingPlies,
  findRedPawnPlies,
  findRedPawnPlies,
  findRedPawnPlies,
  findRedPawnPlies,
  findRedPawnPlies,
];

export function findAnyProtectionBy(position, pid) {
  return any(findProtectionsBy(position, pid));
}

export function* findProtectionsBy({ board }, pid) {
  if (pids.isEmpty(pid)) {
    return;
  }
  yield* (pids.isRed(pid) ? findRedProtectionsBy : findBlackProtectionsBy)(board, pid);
}

function* findBlackProtectionsBy(board, pid) {
  for (const ply of findRedProtectionsBy(board.mirror, pids.mirror(pid))) {
    yield ply.mirror;
  }
}

function* findRedProtectionsBy(board, pid) {
  const sid = board.pieces.get(pid);
  for (const to of YIELD_FNS[pid](sid, board)) {
    const captured = board.at(to);
    if (pids.isRed(captured) && !pids.isRedKing(captured)) {
      yield new Square(to, captured);
    }
  }
}

export function* findPlies({ board, color }) {
  yield* (color === COLOR.RED ? findRedPlies : findBlackPlies)(board);
}

export function* findPliesOf({ board }, pid) {
  if (pids.isEmpty(pid)) {
    return;
  }
  const sid = board.pieces.get(pid);
  yield* (pids.isRed(pid) ? findRedPliesOf : findBlackPliesOf)(board, pid, sid);
}

function* findRedPlies(board) {
  for (const { pid, sid } of board.pieces.RED) {
    yield* findRedPliesOf(board, pid, sid);
  }
}

function* findBlackPliesOf(board, pid, from) {
  for (const ply of findRedPliesOf(board.mirror, pids.mirror(pid), c.mirror(from))) {
    yield ply.mirror;
  }
}

function* findRedPliesOf(board, pid, from) {
  for (const to of YIELD_FNS[pid](from, board)) {
    const captured = board.at(to);
    if (!pids.isRed(captured)) {
      yield new Ply(from, to, pid, captured);
    }
  }
}

function* findBlackPlies(board) {
  for (const ply of findRedPlies(board.mirror)) {
    yield ply.mirror;
  }
}

function* findRedKingPlies(sid) {
  const rank = sid >> 4;
  if (rank > 0) {
    yield sid + c.DOWN;
  }
  if (rank < 2) {
    yield sid + c.UP;
  }
  const file = sid & 0xf;
  if (file > 3) {
    yield sid + c.LEFT;
  }
  if (file < 5) {
    yield sid + c.RIGHT;
  }
}

function* findRedAdvisorPlies(sid) {
  if (sid === 0x14) {
    yield 0x03;
    yield 0x05;
    yield 0x23;
    yield 0x25;
  } else {
    yield 0x14;
  }
}

const ELEPHANT_Plies = [
  0x20, 0x02, 0x42, 0x24, 0x06, 0x46, 0x28
].reduce((map, sid) => {
  const rank = sid >> 4;
  const file = sid & 0xf;
  const candidates = [];
  function add(direction) {
    const blocker = sid + direction;
    candidates.push([blocker, blocker + direction]);
  }
  if (file > 0) {
    rank > 0 && add(c.DL);
    rank < 4 && add(c.UL);
  }
  if (file < 8) {
    rank > 0 && add(c.DR);
    rank < 4 && add(c.UR);
  }
  map.set(sid, candidates);
  return map;
}, new Map());

function* findRedElephantPlies(sid, board) {
  for (const [blocker, target] of ELEPHANT_Plies.get(sid)) {
    if (isEmpty(board, blocker)) {
      yield target;
    }
  }
}

function* findRedHorsePlies(sid, board) {
  const rank = sid >> 4;
  const file = sid & 0xf;
  if (file > 1 && isEmpty(board, sid + c.LEFT)) {
    if (rank > 0) {
      yield sid + c.L2D;
    }
    if (rank < 9) {
      yield sid + c.L2U;
    }
  }
  if (file < 7 && isEmpty(board, sid + c.RIGHT)) {
    if (rank > 0) {
      yield sid + c.R2D;
    }
    if (rank < 9) {
      yield sid + c.R2U;
    }
  }
  if (rank > 1 && isEmpty(board, sid + c.DOWN)) {
    if (file > 0) {
      yield sid + c.D2L;
    }
    if (file < 8) {
      yield sid + c.D2R;
    }
  }
  if (rank < 8 && isEmpty(board, sid + c.UP)) {
    if (file > 0) {
      yield sid + c.U2L;
    }
    if (file < 8) {
      yield sid + c.U2R;
    }
  }
}

const DIRS = [c.UP, c.DOWN, c.LEFT, c.RIGHT];

function* findRedRookPlies(sid, board) {
  for (const dir of DIRS) {
    yield* findRedRookPliesAtDirection(sid, board, dir);
  }
}

function* findRedRookPliesAtDirection(sid, board, dir) {
  for (const target of c.iterate(sid, dir)) {
    yield target; // red target will be ruled out later
    if (!isEmpty(board, target)) {
      return;
    }
  }
}

function* findRedCannonPlies(sid, board) {
  for (const dir of DIRS) {
    yield* findRedCannonPliesAtDirection(sid, board, dir);
  }
}

function* findRedCannonPliesAtDirection(sid, board, dir) {
  let taking = false;
  for (const target of c.iterate(sid, dir)) {
    const empty = isEmpty(board, target);
    if (taking) {
      if (!empty) {
        yield target; // red target will be ruled out later
        return;
      }
    } else {
      if (empty) {
        yield target;
      } else {
        taking = true;
      }
    }
  }
}

function* findRedPawnPlies(sid) {
  const rank = sid >> 4;
  if (rank < 5) {
    yield sid + c.UP;
  } else {
    // across the river
    if (rank < 9) {
      yield sid + c.UP;
    }
    const file = sid & 0xf;
    if (file > 0) {
      yield sid + c.LEFT;
    }
    if (file < 8) {
      yield sid + c.RIGHT;
    }
  }
}

function isEmpty(board, sid) {
  return pids.isEmpty(board.at(sid));
}
