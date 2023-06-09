import { pids } from '../../constant/index.js';

const NAIVE_PIECE_VALUE = 400;

export function naive() {
  return NAIVE_PIECE_VALUE;
}

const STD_PAWN_VALUE = 100;
const STD_PAWN_VALUE_ACROSS_RIVER = 200;
const STD_VALUES = [
  200, // advisor
  200, // elephant
  400, // horse
  900, // rook
  450, // cannon
  999999, // king, should not be used
];

export function standard(position, pid) {
  const pidAsRed = pids.asRed(pid);
  if (!pids.isRedPawn(pidAsRed)) {
    return STD_VALUES[pidAsRed >> 1];
  }
  const rank = position.board.pieces.get(pid) >> 4;
  return pids.isRed(pid) === (rank > 4) ? STD_PAWN_VALUE_ACROSS_RIVER : STD_PAWN_VALUE;
}
