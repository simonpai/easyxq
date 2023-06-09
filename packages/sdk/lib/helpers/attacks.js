import { pids, PIECE as p, COLOR, colors, coordinates as c } from '../constant/index.js';
import { any } from './utils.js';
import { isLegalPly } from './validate-plies.js';
import { findPliesOf } from './find-plies.js';

// check: noun, uncountable
// * Red king is in check from a black rook.
// * Red player gives check to the black king.

export function findAnyCheck(position) {
  return any(findChecks(position));
}

export function* findChecks(position) {
  yield* findAttacksTo(position, pids.king(position.color));
}



export function findAnyAttacksBy(position, pid) {
  return any(findAttacksBy(position, pid));
}

export function* findAttacksBy(position, pid) {
  for (const ply of findPliesOf(position, pid)) {
    if (pids.isPiece(ply.captured)) {
      yield ply;
    }
  }
}

export function isAttackedBy(position, pid, attackerPid) {
  const { pieces } = position.board;
  return isLegalPly(position, pieces.get(attackerPid), pieces.get(pid), pids.color(attackerPid));
}



export function findAnyProtectionTo(position, pid) {
  return any(findProtectionsTo(position, pid));
}

export function* findProtectionsTo(position, pid) {
  const color = pids.color(pid);
  const sid = position.board.pieces.get(pid);
  yield* findAttacksToSid(position, { color, sid });
}



export function findAnyAttackTo(position, pid) {
  return any(findAttacksTo(position, pid));
}

export function* findAttacksTo(position, pid) {
  const color = colors.mirror(pids.color(pid));
  const sid = position.board.pieces.get(pid);
  const toKing = pids.isKing(pid);
  yield* findAttacksToSid(position, { color, sid, toKing });
}

export function findAnyAttackToSid(position, options) {
  return any(findAttacksToSid(position, options));
}

export function* findAttacksToSid({ board }, { color, sid, toKing = false } = {}) {
  const fn = color === COLOR.RED ? findRedAttacksTo : findBlackAttacksTo;
  for (const from of fn(board, sid, toKing)) {
    yield board.ply(from, sid);
  }
}

function* findRedAttacksTo(board, sid, toKing) {
  for (const from of findBlackAttacksTo(board.mirror, c.mirror(sid), toKing)) {
    yield c.mirror(from);
  }
}

function* findBlackAttacksTo(board, sid, toKing) {
  // find pawn, rook, cannon, king attacks from 4 directions
  for (const direction of [c.UP, c.LEFT, c.RIGHT, c.DOWN]) {
    yield* findBlackAttacksToFromDirection(board, sid, direction, toKing);
  }

  // find horse attacks
  yield* findBlackAttacksByHorseTo(board, sid);

  // find elephant attacks
  if (!toKing) {
    yield* findBlackAttacksByElephantTo(board, sid);
  }

  // find advisor attacks
  if (!toKing) {
    yield* findBlackAttacksByAdvisorTo(board, sid);
  }
}

function* findBlackAttacksToFromDirection(board, sid, direction, forKing = false) {
  let blocked = false;
  let firstStep = true;
  for (const from of c.iterate(sid, direction)) {
    const pid = board.at(from);
    if (pids.isEmpty(pid)) {
      firstStep = false;
      continue;
    }
    const piece = pids.piece(pid);
    if (blocked) {
      if (piece === p.BC) {
        yield from;
      }
      return;
    }
    switch (piece) {
      case p.BR:
        yield from;
        break;
      case p.BK:
        if (forKing || firstStep) {
          yield from;
        }
        break;
      case p.BP:
        if (firstStep && direction !== c.DOWN && (direction === c.UP || ((from >> 4) < 5))) {
          yield from;
        }
        break;
    }
    firstStep = false;
    blocked = true;
  }
}

const HORSE_ATTACK_CANDIDATES = [
  [c.UL, c.U2L, c.L2U],
  [c.UR, c.U2R, c.R2U],
  [c.DL, c.D2L, c.L2D],
  [c.DR, c.D2R, c.R2D],
];

function* findBlackAttacksByHorseTo(board, sid) {
  for (const [blocker, ...attackers] of HORSE_ATTACK_CANDIDATES) {
    if (!pids.isEmpty(board.at(sid + blocker))) {
      continue;
    }
    for (const diff of attackers) {
      const from = sid + diff;
      if (!c.inBounds(from)) {
        continue;
      }
      const pid = board.at(from);
      if (pids.isBlackHorse(pid)) {
        yield from;
      }
    }
  }
}

const ELEPHANT_ATTACK_CANDIDATES = [
  [c.UL, c.U2L2],
  [c.UR, c.U2R2],
  [c.DL, c.D2L2],
  [c.DR, c.D2R2],
];

function* findBlackAttacksByElephantTo(board, sid) {
  if (!c.ELEPHANTS.BLACK.has(sid)) {
    return;
  }
  for (const [blocker, attacker] of ELEPHANT_ATTACK_CANDIDATES) {
    if (!pids.isEmpty(board.at(sid + blocker))) {
      continue;
    }
    const from = sid + attacker;
    if (!c.inBounds(from)) {
      continue;
    }
    const pid = board.at(from);
    if (pids.isBlackElephant(pid)) {
      yield from;
    }
  }
}

function* findBlackAttacksByAdvisorTo(board, sid) {
  if (sid === 0x84) {
    let count = 0;
    for (const from of c.PALACE_CORNERS.BLACK) {
      const pid = board.at(from);
      if (pids.isBlackAdvisor(pid)) {
        yield from;
        if (++count === 2) {
          break; // at most 2 advisors
        }
      }
    }
  }
  if (c.PALACE_CORNERS.BLACK.has(sid)) {
    const pid = board.at(0x84);
    if (pids.isBlackAdvisor(pid)) {
      yield 0x84;
    }
  }
}
