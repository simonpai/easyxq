import { sortBy } from '@easyxq/commons';
import { pids } from '../../../constant/index.js';
import { variable as v } from './utils.js';
import { findAttacksTo, findAnyAttackTo, isAttackedBy, findAttacksBy, findProtectionsBy } from '../../../helpers/index.js';
import * as values from '../values.js';

const PREFIX = 'naive.';

function n(name) {
  return PREFIX + name;
}

const DEFAULT_VALUING = 'naive';
const UNFOCUSED_PENALTY = 0.5;
const TEMPO_SCORE = 50;

/**
 * If the move captures a piece, gain value of that piece.
 */
export function capture({ valuing = DEFAULT_VALUING } = {}) {
  const valueFn = values[valuing];
  return v(n('capture'), ({ before, ply, t }) => {
    const { captured } = ply;
    if (!pids.isPiece(captured)) {
      return 0;
    }
    const isFocused = t.memoize(`capture.is-focused`, ({ lastPlies }) => {
      const len = lastPlies.length;
      return len === 0 ? () => false :
        len === 1 ? ({ captured }) => captured === lastPlies[0].pid :
        ({ captured, pid }) => captured === lastPlies[0].pid || pid === lastPlies[1].pid;
    });
    const score = valueFn(before, captured);
    return isFocused(ply) ? score : score * UNFOCUSED_PENALTY;
  });
}

/**
 * If the moved piece moves away from a hanging square, gain value of that piece.
 * If the moved piece moves into a hanging square, lose value of that piece.
 */
export function dodge({ valuing = DEFAULT_VALUING } = {}) {
  const valueFn = values[valuing];
  return v(n('dodge'), ({ lastPlies, ply, before, after }) => {
    const { pid } = ply;
    const lastPlyPid = lastPlies[0] && lastPlies[0].pid;
    const focused = isAttackedBy(before, pid, lastPlyPid) || isAttackedBy(after, pid, lastPlyPid);

    // only count in unfocused penalty on before position
    // for you'd definitely notice if you move a piece into a hanging square
    let score = getHangingPieceValue(valueFn, before, pid);
    if (!focused) {
      score *= UNFOCUSED_PENALTY;
    }
    return score - getHangingPieceValue(valueFn, after, pid);
  });
}

/**
 * If the moved piece moves away from a protecting a piece (making it hanging), lose the value of that piece.
 * If the moved piece moves to protect a piece or makes a capture that eliminates a threat, gain the value of protected piece.
 * If there are multiple pieces protected, the one with the highest value is counted.
 */
export function protect({ valuing = DEFAULT_VALUING } = {}) {
  const valueFn = values[valuing];
  return v(n('protect'), ({ ply, before, after, t }) => {
    const { pid, captured } = ply;
    const focusedTargets = t.memoize(`protect.focused-targets`, ({ lastPlies, before }) => {
      return lastPlies.length === 0 ? new Set() : new Set([...findAttacksBy(before, lastPlies[0].pid)].map(ply => ply.captured));
    });
    const hangingAfterMove = isHangingPiece(after, pid);
    const threatEliminated = !hangingAfterMove && pids.isPiece(captured) ? getChaseScore(valueFn, before, captured) : 0;
    const protectionScoreAfter = !hangingAfterMove ? getProtectionScore(after, before, pid, focusedTargets, valueFn) : 0;
    const protectionScoreBefore = getProtectionScore(before, after, pid, focusedTargets, valueFn);
    // if pieces protected and saved (from threat) are different, the scores should be summed
    // but it's naive so anyway
    return Math.max(threatEliminated, protectionScoreAfter) - protectionScoreBefore;
  });
}

/**
 * Gain TEMPO_SCORE if the move puts the opponent in check, otherwise 0.
 * It's possible to score by the most valuable hanging piece but that would be too good for a naive heuristic.
 */
export function check() {
  return v(n('check'), ({ ply, after }) => {
    const { pid } = ply;
    for (const { captured } of findAttacksBy(after, pid)) {
      if (pids.isKing(captured)) {
        return TEMPO_SCORE;
      }
    }
    return 0;
  });
}

/**
 * Gain TEMPO_SCORE if the moved piece chases another piece.
 * Lose TEMPO_SCORE if the moved piece doesn't capture and was chasing another piece before.
 * It's possible to score by the second most valuable chased piece but that would be too good for a naive heuristic.
 */
export function chase() {
  return v(n('chase'), ({ ply, before, after }) => {
    const { pid, captured } = ply;
    const score = isChasing(after, pid) ? TEMPO_SCORE : 0;
    return !pids.isPiece(captured) && isChasing(before, pid) ? score - TEMPO_SCORE : score;
  });
}

// helpers //
function getProtectionScore(position, otherPosition, protectorPid, focusedTargetPids, valueFn) {
  const protections = [];
  for (const { pid } of findProtectionsBy(position, protectorPid)) {
    // keep track of values as well
    let score = valueFn(position, pid);
    if (!focusedTargetPids.has(pid)) {
      score *= UNFOCUSED_PENALTY;
    }
    protections.push({ pid, score });
  }

  for (const { pid, score } of sortBy(protections, en => -en.score)) {
    if (isHangingPiece(otherPosition, pid)) {
      return score; // is protected, hanging otherwise
    }
  }

  return 0;
}

function isChasing(position, pid) {
  if (isHangingPiece(position, pid)) {
    return false;
  }
  for (const { captured } of findAttacksBy(position, pid)) {
    if (pids.isKing(captured)) {
      continue; // this is check, not chase
    }
    if (isHangingPiece(position, captured)) {
      return true;
    }
  }
  return false;
}

function getChaseScore(valueFn, position, pid) {
  if (isHangingPiece(position, pid)) {
    return 0;
  }
  let attacked = [];
  for (const { captured } of findAttacksBy(position, pid)) {
    if (pids.isKing(captured)) {
      continue; // this is check, not chase
    }
    const score = valueFn(position, captured);
    attacked.push({ captured, score });
  }

  for (const { captured, score } of sortBy(attacked, en => -en.score)) {
    if (isHangingPiece(position, captured)) {
      return score;
    }
  }
  return 0;
}

function getHangingPieceValue(fn, position, pid) {
  return isHangingPiece(position, pid) ? fn(position, pid) : 0;
}

function isHangingPiece(position, pid) {
  if (pids.isKing(pid)) {
    return false;
  }
  for (const ply of findAttacksTo(position, pid)) {
    if (!findAnyAttackTo(position.preview(ply), ply.pid)) {
      return true;
    }
  }
  return false;
}
