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
const OBLIVION_PENALTY = 0.5;
const TEMPO_SCORE = 50;

const SYMBOL_CAPTURE_IS_OBVIOUS_PLY = Symbol('capture.obvious-ply');
const SYMBOL_PROTECT_IS_OBVIOUS_TARGETS = Symbol('protect.obvious-targets');
const SYMBOL_PROTECT_SCALED_VALUE_FN = Symbol('protect.scaled-value-fn');

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
    const isObvious = t.memoize(SYMBOL_CAPTURE_IS_OBVIOUS_PLY, computeIsObviousPredicateForCapture);
    const score = valueFn(before, captured);
    return isObvious(ply) ? score : score * OBLIVION_PENALTY;
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
    const obvious = isAttackedBy(before, pid, lastPlyPid) || isAttackedBy(after, pid, lastPlyPid);

    // only count in oblivion penalty on before position
    // for you'd definitely (?) notice if you move a piece into a hanging square
    let score = getThreatedScore(valueFn, before, pid);
    if (!obvious) {
      score *= OBLIVION_PENALTY;
    }
    return score - getThreatedScore(valueFn, after, pid);
  });
}

/**
 * If the moved piece moves away from a protecting a piece (making it hanging), lose the value of that piece.
 * If the moved piece moves to protect a piece or makes a capture that eliminates a threat, gain the value of protected piece.
 * If there are multiple pieces protected, the one with the highest value is counted.
 */
export function protect({ valuing = DEFAULT_VALUING, oblivionPenalty = OBLIVION_PENALTY } = {}) {
  const valueFn = values[valuing];
  const computeScaledValueFn = getComputeScaledValueFnForProtect(valueFn, oblivionPenalty);
  return v(n('protect'), ({ ply, before, after, t }) => {
    const { pid, captured } = ply;
    const hangingAfterMove = isHangingPiece(after, pid);
    const scaledValueFn = t.memoize(SYMBOL_PROTECT_SCALED_VALUE_FN, computeScaledValueFn);
    const threatEliminated = !hangingAfterMove && pids.isPiece(captured) ? getThreateningScore(valueFn, before, captured) : 0;
    const protectionScoreAfter = !hangingAfterMove ? getProtectionScore(after, before, pid, scaledValueFn) : 0;
    const protectionScoreBefore = getProtectionScore(before, after, pid, scaledValueFn);
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
function computeIsObviousPredicateForCapture({ lastPlies }) {
  const len = lastPlies.length;
  return len === 0 ? () => false :
    len === 1 ? ({ captured }) => captured === lastPlies[0].pid :
    ({ captured, pid }) => captured === lastPlies[0].pid || pid === lastPlies[1].pid;
}

function computeIsObviousTargetPredicateForProtect({ lastPlies, before }) {
  if (lastPlies.length === 0) {
    return () => false;
  }
  const targets = new Set([...findAttacksBy(before, lastPlies[0].pid)].map(ply => ply.captured));
  return pid => targets.has(pid);
}

function getComputeScaledValueFnForProtect(valueFn, oblivionPenalty) {
  return ({ lastPlies, before }) => {
    const isObvious = computeIsObviousTargetPredicateForProtect({ lastPlies, before });
    return (position, pid) => {
      const score = valueFn(position, pid);
      return isObvious(pid) ? score : score * oblivionPenalty;
    };
  };
}

function getProtectionScore(position, otherPosition, protectorPid, valueFn) {
  const protections = [];
  for (const { pid } of findProtectionsBy(position, protectorPid)) {
    // keep track of scores as well
    protections.push({ pid, score: valueFn(position, pid) });
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

function getThreateningScore(valueFn, position, pid) {
  let maxScore = 0;
  for (const ply of findAttacksBy(position, pid)) {
    const after = position.preview(ply);
    let score = valueFn(after, ply.captured);
    if (isHangingPiece(after, ply.pid)) {
      score -= valueFn(after, ply.pid);
    }
    maxScore = Math.max(maxScore, score);
  }
  return maxScore;
}

function getThreatedScore(valueFn, position, pid) {
  if (pids.isKing(pid)) {
    return 0; // in check
  }
  let minAttackerScore = Infinity;
  for (const ply of findAttacksTo(position, pid)) {
    const after = position.preview(ply);
    if (!findAnyAttackTo(after, ply.pid)) {
      // hanging, will lose this much value next turn
      return valueFn(position, pid);
    }
    minAttackerScore = Math.min(minAttackerScore, valueFn(after, ply.pid));
  }
  // not threatened by any piece
  if (minAttackerScore === Infinity) {
    return 0;
  }
  // not hanging. if opponent captures, will lost this much value but can recapture something next turn
  return Math.max(valueFn(position, pid) - minAttackerScore, 0);
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
