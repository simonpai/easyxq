import { COLOR, pids } from '../../../constant/index.js';
import { predicate as p } from './utils.js';

export { t, f, and, or } from './utils.js';

/**
 * Returns true if
 *   1. My cannon captures a horse
 *   2. My cannon was at initial position
 *   3. Your horse was at initial position
 *   4. Your rook on the same side was at initial position
 */
export function isNaiveOpeningCannonAttack() {
  return IS_NAIVE_OPENING_CANNON_ATTACK;
}

const IS_NAIVE_OPENING_CANNON_ATTACK = p(({ before, ply }) => {
  const isBlack = before.color === COLOR.BLACK;
  if (isBlack) {
    ply = ply.mirror;
  }
  const { pid, captured, from, to } = ply;
  if (!pids.isRedCannon(pid) || !pids.isBlackHorse(captured)) {
    return false;
  }
  const left = from === 0x21;
  if ((!left && from !== 0x27) || to !== (left ? 0x91 : 0x97)) {
    return false;
  }
  const board = isBlack ? before.board.mirror : before.board;
  return pids.isBlackRook(board.at(left ? 0x90 : 0x98));
});

export function isNaiveOpeningCannonChase() {
  return IS_NAIVE_OPENING_CANNON_CHASE;
}

const IS_NAIVE_OPENING_CANNON_CHASE = p(({ before, ply }) => {
  if (before.moveNum > 3) {
    return false; // only apply to the first 3 moves (6 plies)
  }
  const isBlack = before.color === COLOR.BLACK;
  if (isBlack) {
    ply = ply.mirror;
  }
  const { pid, to } = ply;
  if (!pids.isRedCannon(pid)) {
    return false; // only apply to cannon
  }
  if (to === 0x61 || to === 0x67) {
    return true; // advance to black pawn rank, bad
  }
  if (to !== 0x22 && to !== 0x24 && to !== 0x26) {
    return false; // aiming for a black pawn files
  }
  const board = isBlack ? before.board.mirror : before.board;
  return pids.isBlackPawn(board.at(to + 0x40));
});
