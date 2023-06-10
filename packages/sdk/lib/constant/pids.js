import * as pieces from './pieces.js';

/*
 *   PID                      Piece
 *   -1:          empty    -> -1
 *
 *   0-1:     red advisor  -> 0
 *   2-3:         elephant -> 1
 *   4-5:         horse    -> 2
 *   6-7:         rook     -> 3
 *   8-9:         cannon   -> 4
 *   10:          king     -> 5
 *   11-15:       pawn     -> 7   = (pid | 0xf) >> 1
 *
 *   16-17: black advisor  -> 8
 *   18-19:       elephant -> 9
 *   20-21:       horse    -> 10
 *   22-23:       rook     -> 11
 *   24-25:       cannon   -> 12
 *   26:          king     -> 13
 *   27-31:       pawn     -> 15  = (pid | 0xf) >> 1
 */

export const EMPTY = -1;

export function king(color) {
  return color === 1 ? 10 : 26;
}

export function isEmpty(pid) {
  return pid < 0;
}

export function isPiece(pid) {
  return pid >= 0;
}

export function isRed(pid) {
  return pid >= 0 && pid < 16;
}

export function isBlack(pid) {
  return pid >= 16;
}

export function asRed(pid) {
  return pid & 0x0f;
}

export function asBlack(pid) {
  return pid | 0x10;
}

export function color(pid) {
  return (pid >> 4) + 1;
}

export function mirror(pid) {
  return isEmpty(pid) ? EMPTY : pid ^ 0x10;
}

export function piece(pid) {
  // TODO: is lookup faster?
  return (asBlack(pid) > 26 ? (pid | 0xf) : pid) >> 1;
}

export function format(pid) {
  return pieces.format(piece(pid));
}

export function en(pid) {
  return pieces.en(piece(pid));
}

// piece check //
export function isRedKing(pid) {
  return pid === 10;
}

export function isBlackKing(pid) {
  return pid === 26;
}

export function isKing(pid) {
  return isRedKing(pid) || isBlackKing(pid);
}

export function isRedAdvisor(pid) {
  return pid >> 1 === 0;
}

export function isBlackAdvisor(pid) {
  return pid >> 1 === 8;
}

export function isAdvisor(pid) {
  return isRedAdvisor(asRed(pid));
}

export function isRedElephant(pid) {
  return pid >> 1 === 1;
}

export function isBlackElephant(pid) {
  return pid >> 1 === 9;
}

export function isElephant(pid) {
  return isRedElephant(asRed(pid));
}

export function isRedHorse(pid) {
  return pid >> 1 === 2;
}

export function isBlackHorse(pid) {
  return pid >> 1 === 10;
}

export function isHorse(pid) {
  return isRedHorse(asRed(pid));
}

export function isRedRook(pid) {
  return pid >> 1 === 3;
}

export function isBlackRook(pid) {
  return pid >> 1 === 11;
}

export function isRook(pid) {
  return isRedRook(asRed(pid));
}

export function isRedCannon(pid) {
  return pid >> 1 === 4;
}

export function isBlackCannon(pid) {
  return pid >> 1 === 12;
}

export function isCannon(pid) {
  return isRedCannon(asRed(pid));
}

export function isRedPawn(pid) {
  return pid >= 11 && pid <= 15;
}

export function isBlackPawn(pid) {
  return pid >= 27 && pid <= 31;
}

export function isPawn(pid) {
  return isRedPawn(asRed(pid));
}
