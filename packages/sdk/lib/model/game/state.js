import Position from '../position.js';

export default class GameState {

  #context;
  #calls;

  // TODO: cycle detection
  // TODO: time

  constructor(context, {
    position = Position.standard(),
    lastMove,
    calls = [],
  } = {}) {
    if (!context) {
      throw new Error('context is required');
    }
    this.#context = context;
    this.#calls = calls;
    this.position = position;
    this.lastMove = lastMove;
    Object.freeze(this);
  }

  get rules() {
    return this.#context.rules;
  }

  get context() {
    return this.#context;
  }

  get queries() {
    return this.#context.queries(this.position);
  }
  
  get nextPlies() {
    return this.queries.nextPlies;
  }

  get nextLegalPlies() {
    return this.queries.nextLegalPlies;
  }

  get result() {
    return this.queries.result;
  }

  get calls() {
    return Object.freeze([
      ...this.#calls,
      ...this.queries.calls,
    ]);
  }

  preview(ply) {
    return new GameState(this.#context, {
      position: this.position.preview(ply),
      lastMove: ply,
    });
  }

  transit(from, to) {
    let { result, position, rules } = this;
    if (result) {
      throw new Error('The game has ended.');
    }

    let calls = [...rules.apply('preMove', { position, from, to })];

    const ply = position.ply(from, to);
    const preview = position.preview(ply);

    calls = [...calls, ...rules.apply('preTransit', { position, ply, preview })];

    position = position.transit(ply);

    calls = [...calls, ...rules.apply('postTransit', { position, ply })];

    return new GameState(this.#context, {
      position,
      lastMove: ply,
      calls,
    });
  }

}
