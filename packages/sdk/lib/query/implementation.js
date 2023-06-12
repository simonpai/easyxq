import { colors, CALL, calls as _calls } from '../constant/index.js';
import { findPlies, findAnyCheck } from '../helpers/index.js';
import InvalidPlyError from '../error/invalid-ply.js';

export function nextPlies(rules, position) {
  return [...findPlies(position)].map(ply => {
    const preview = position.preview(ply);

    try {
      ply.calls = [...rules.apply('preTransit', { position, ply, preview })];
    } catch(error) {
      ply.calls = [errorToCall(error)];
    }

    for (const call of ply.calls) {
      if (call.type === CALL.VIOLATION) {
        ply.violation = call;
        break;
      }
    }

    return ply;
  });
}

export function nextLegalPlies(rules, position) {
  return nextPlies(rules, position).filter(ply => !ply.violation);
}

export function hasLegalPly(rules, position) {
  PLY:
  for (const ply of findPlies(position)) {
    const preview = position.preview(ply);
    try {
      for (const _ of rules.apply('preTransit', { position, ply, preview }));
    } catch(error) {
      // TODO: use name
      if (error instanceof InvalidPlyError) {
        continue PLY;
      } else {
        throw error;
      }
    }
    return true;
  }
  return false;
}

export function isInCheck(_, position) {
  return !!findAnyCheck(position);
}

export function calls(rules, position) {
  return [...rules.apply('onPosition', { position })];
}

export function result(rules, position) {
  return _calls.getResult(calls(rules, position));
}

/**
 * It's impossible to have a player in check after their own move. This query is only used to detect illigal moves.
 */
export function anyCheckToPreviousPlayersKing(_, position) {
  const { board, color, hash } = position;
  const check = findAnyCheck({ board, color: colors.mirror(color), hash });
  return check;
}

function errorToCall(error) {
  // TODO: use name
  if (error instanceof InvalidPlyError) {
    return {
      type: CALL.VIOLATION,
      reason: error.message,
    };
  } else {
    throw error;
  }
}
