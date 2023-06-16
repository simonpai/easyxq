import * as c from './coordinates.js';
import * as COLOR from './color.js';
import * as PIECE from './piece.js';
import * as pieces from './pieces.js';
import * as pids from './pids.js';

export function notate(position, ply) {
  const info = analyzeStackInfo(position, ply);
  return `${notatePiece(info)}${notateMovement(info)}`;
}

export function parse(position, notation) {
}

function analyzeStackInfo(position, ply) {
  const piece = pids.piece(ply.pid);
  const color = pids.color(ply.pid);
  let board = position.board;

  if (color === COLOR.BLACK) {
    board = board.mirror;
    ply = ply.mirror;
  }

  const { from, to } = ply;
  const file = c.file(from);

  let stack = 0;
  let ordinal = 0;
  let disambiguation = false;

  switch (pieces.asRed(piece)) {
    case PIECE.RK:
    case PIECE.RA:
    case PIECE.RE:
      stack = 1;
      break;
    case PIECE.RH:
    case PIECE.RR:
    case PIECE.RC:
      const otherPid = ply.pid ^ 0x1;
      const otherSid = board.pieces.get(otherPid);
      if (c.isUnavailable(otherSid) || c.file(otherSid) !== file) {
        stack = 1;
      } else {
        stack = 2;
        if (c.rank(from) < c.rank(otherSid)) {
          // larger rank means in front of the other
          ordinal++;
        }
      }
      break;
    case PIECE.RP:
      const rank = c.rank(from);
      let files = 0;
      for (const { sid } of board.pieces.RED_PAWNS) {
        if (c.isUnavailable(sid)) {
          continue;
        }
        const f = c.file(sid);
        const fbit = 1 << f;
        if (f === file) {
          // same file
          if (c.rank(sid) > rank) {
            ordinal++;
          }
          stack++;
        } else if (files & fbit) {
          // not same file, but seen twice
          disambiguation = true;
        }
        files |= fbit;
      }
      break;
    default:
      throw new Error(`Unknown piece: ${piece}`);
  }
  return {
    color,
    piece,
    from,
    to,
    file,
    stack,
    ordinal,
    disambiguation,
  };
}

const RED_NUMBERS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const BLACK_NUMBERS = ['１', '２', '３', '４', '５', '６', '７', '８', '９'];

const FORWARD = '進';
const BACKWARD = '退';
const SIDEWAYS = '平';

const FRONT = '前';
const MIDDLE = '中';
const BACK = '後';

function notateDistance(color, n) {
  return (color === COLOR.RED ? RED_NUMBERS : BLACK_NUMBERS)[n - 1];
}

function notateFile(color, n) {
  return (color === COLOR.RED ? RED_NUMBERS : BLACK_NUMBERS)[8 - n];
}

function notateFileOrPiece({ color, piece, file, disambiguation }) {
  return disambiguation ? notateFile(color, file) : pieces.zh(piece);
}

function notateMovement({ color, from, to }) {
  const fromFile = c.file(from);
  const fromRank = c.rank(from);
  const toFile = c.file(to);
  const toRank = c.rank(to);
  return `${toRank === fromRank ? SIDEWAYS : toRank > fromRank ? FORWARD : BACKWARD}${fromFile === toFile ? notateDistance(color, Math.abs(toRank - fromRank)) : notateFile(color, toFile)}`;
}

function notatePiece(info) {
  const { stack, color, piece, file } = info;
  return stack === 1 ?
    `${pieces.zh(piece)}${notateFile(color, file)}` :
    `${notateOrdinal(info)}${notateFileOrPiece(info)}`;
}

function notateOrdinal({ ordinal, stack }) {
  if (ordinal === 0) {
    return FRONT;
  }
  switch (stack) {
    case 1:
      throw new Error('Unexpected stack size: 1');
    case 2:
      return BACK;
    case 3:
      return ordinal === 1 ? MIDDLE : BACK;
    default:
      return RED_NUMBERS[ordinal];
  }
}
