import { randomInt } from '@easyxq/commons';
import { colors, pids } from '../constant/index.js';

const table = new Map();

function getOrCompute(key) {
  if (table.has(key)) {
    return table.get(key);
  }
  const value = randomInt();
  table.set(key, value);
  return value;
}

function hashSquare(pid, sid) {
  const key = (sid << 4) + pids.piece(pid);
  return getOrCompute(key);
}

export function hashBoard(board) {
  let hash = 0;
  for (const { pid, sid } of board.pieces) {
    hash ^= hashSquare(pid, sid);
  }
  return hash;
}

export function hashPly({ pid, from, captured, to }) {
  const hash = hashSquare(pid, from) ^ hashSquare(pid, to);
  return pids.isPiece(captured) ? hash ^ hashSquare(captured, to) : hash;
}

export function hashPosition({ board, color }) {
  const hash = board.hash ^ colors.index(color);
  return hash & hash; // to 32-bit integer
}
