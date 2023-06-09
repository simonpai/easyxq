import { pids, pieces, colors, RULE, CALL } from '../constant/index.js';
import { validatePly } from '../helpers/index.js';
import InvalidPlyError from '../error/invalid-ply.js';

export default class BaseRules {

  static get name() {
    return RULE.BASE;
  }

  #context;

  initialize(context) {
    this.#context = context;
  }

  *preMove({ position, from, to }) {
    validatePly(position, from, to);
  }

  *preTransit({ preview }) {
    // if this move causes player's king to be in check, it is not legal
    const check = this.#context.queries(preview).anyCheckToPreviousPlayersKing;
    if (check) {
      throw new InvalidPlyError(`King in check by ${pieces.en(pids.piece(check.pid))} after the move.`, { check });
    }
  }

  *onPosition({ position }) {
    // no more legal moves -> checkmate or stalemate
    const queries = this.#context.queries(position);
    if (!queries.hasLegalPly) {
      const { isInCheck } = queries;
      yield {
        type: CALL.RESULT,
        result: CALL.DECISIVE,
        winner: colors.mirror(position.color),
        reason: isInCheck ? 'checkmate' : 'stalemate',
      };
    }
  }

}
