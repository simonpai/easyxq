import { pids, colors, COLOR, coordinates as c } from '../constant/index.js';
import InvalidPlyError from '../error/invalid-ply.js';

export function isLegalPly(position, from, to, color) {
  try {
    validatePly(position, from, to, color);
    return true;
  } catch (error) {
    return false;
  }
}

export function validatePly(position, from, to, color = position.color) {
  vaildateCoordinates(from, to);
  validatePieceColors(position, from, to, color);
  validateMovement(position, from, to, color);
}

function vaildateCoordinates(from, to) {
  if (!c.inBounds(from)) {
    throw new InvalidPlyError(`Origin square index is out of bound: ${from}`);
  }
  if (!c.inBounds(to)) {
    throw new InvalidPlyError(`Destination square index is out of bound: ${to}`);
  }
  if (from === to) {
    throw new InvalidPlyError(`Origin and destination cannot be the same: ${c.format(from)}`);
  }
}

function validatePieceColors(position, from, to, color) {
  const { board } = position;
  const pid = board.at(from);
  // origin square must have a piece of player's color
  if (pids.color(pid) !== color) {
    throw new InvalidPlyError(`No ${colors.en(color)} piece at ${c.format(from)}`);
  }
  // destination must not be occupied by a piece of the player's color
  const captured = board.at(to);
  if (pids.color(captured) === color) {
    throw new InvalidPlyError(`A ${colors.en(color)} piece occupies destination square: ${c.format(to)}`);
  }
}

const VALIDATIONS = [
  validateAdvisor,
  validateElephant,
  validateHorse,
  validateRook,
  validateCannon,
  validateKing,
  undefined,
  validatePawn,
];

function validateMovement(position, from, to, color) {
  let { board } = position;
  let pid = board.at(from);
  // we can always evaluate as red
  if (color === COLOR.BLACK) {
    board = board.mirror;
    pid = pids.mirror(pid);
    from = c.mirror(from);
    to = c.mirror(to);
  }
  VALIDATIONS[pids.piece(pid)](from, to, board);
}

function validateKing(from, to) {
  const file = to & 0xf;
  const rank = to >> 4;
  if (file < 3 || file > 5 || rank > 2) {
    throw new InvalidPlyError(`Illegal destination for king.`);
  }
  const diff = Math.abs(to - from);
  if (diff !== 0x1 && diff !== 0x10) {
    throw new InvalidPlyError(`Illegal movement for king.`);
  }
}

function validateAdvisor(from, to) {
  if ((from === 0x14 && atPalaceCorner(to)) || (to === 0x14 && atPalaceCorner(from))) {
    return;
  }
  throw new InvalidPlyError(`Illegal movement for advisor.`);
}

function validateElephant(from, to, board) {
  const diff = Math.abs(from - to);
  if (diff !== 0x22 && diff !== 0x1e) {
    throw new InvalidPlyError(`Illegal movement for elephant.`);
  }
  validateEmpty(board, (from + to) >> 1, 'Elephant');
}

function validateHorse(from, to, board) {
  const diff = to - from;
  let horseFootDiff;
  switch (diff) {
    case 0x21:
    case 0x1f:
      horseFootDiff = 0x10;
      break;
    case -0x21:
    case -0x1f:
      horseFootDiff = -0x10;
      break;
    case 0x12:
    case -0x0e:
      horseFootDiff = 0x01;
      break;
    case -0x12:
    case 0x0e:
      horseFootDiff = -0x01;
      break;
    default:
      throw new InvalidPlyError(`Illegal movement for horse.`);
  }
  validateEmpty(board, from + horseFootDiff, 'Horse');
}

function validateRook(from, to, board) {
  const step = stepOf(from, to, 'rook');
  for (let i = from + step; i !== to; i += step) {
    validateEmpty(board, i, 'Rook');
  }
}

function validateCannon(from, to, board) {
  const step = stepOf(from, to, 'cannon');
  const capturing = !pids.isEmpty(board.at(to));
  const requiredPieceCount = capturing ? 1 : 0;
  let c = 0;
  for (let i = from + step; i !== to; i += step) {
    if (!pids.isEmpty(board.at(i))) {
      c++;
      if (c > requiredPieceCount) {
        break;
      }
    }
  }
  if (c !== requiredPieceCount) {
    throw new InvalidPlyError(`Illegal movement for cannon.`);
  }
}

function validatePawn(from, to) {
  const diff = to - from;
  if (diff === 0x10 || ((diff === 1 || diff === -1) && (from >> 4) > 4)) {
    return;
  }
  throw new InvalidPlyError(`Illegal movement for pawn.`);
}

// helper //
function atPalaceCorner(index) {
  const rank = index >> 4;
  const file = index & 0xf;
  return (rank === 0 || rank === 2) && (file === 3 || file === 5);
}

function validateEmpty(board, index, pieceLabel) {
  if (!pids.isEmpty(board.at(index))) {
    throw new InvalidPlyError(`${pieceLabel} movement is blocked.`);
  }
}

function stepOf(from, to, pieceLabel) {
  const fromRank = from >> 4;
  const fromFile = from & 0xf;
  const toRank = to >> 4;
  const toFile = to & 0xf;
  if (fromRank !== toRank && fromFile !== toFile) {
    throw new InvalidPlyError(`Illegal movement for ${pieceLabel}.`);
  }
  return (fromRank === toRank) ? (fromFile < toFile ? 1 : -1) : (fromRank < toRank ? 0x10 : -0x10);
}
