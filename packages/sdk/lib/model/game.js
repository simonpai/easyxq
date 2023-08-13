import { pids, plies as _plies } from '../constant/index.js';
import Position from './position.js';
import Ply from './ply.js';

export default class Game {

  static #standard;

  static standard() {
    return Game.#standard || (Game.#standard = new Game());
  }

  static parsePgn(str) {
    const lines = str.split('\n');
    for (const line of lines) {
      // TODO
    }
  }

  static load({
    initialPosition,
    position,
    plies,
    result,
    tags,
  }) {
    initialPosition = initialPosition ? Position.load(initialPosition) : Position.standard();
    position = position ? Position.load(position) : initialPosition;
    plies = plies.map(Ply.decode);
    return new Game({ initialPosition, position, plies, result, tags });
  }

  #pgn;
  #snapshot;

  constructor({
    initialPosition = Position.standard(),
    position = initialPosition,
    plies = [],
    result,
    tags = {},
  } = {}) {
    plies = Object.freeze(plies);
    tags = Object.freeze(tags);
    Object.assign(this, { initialPosition, position, plies, result, tags });
    Object.freeze(this);
  }

  get lastPly() {
    return this.plies[this.plies.length - 1];
  }

  get index() {
    return this.plies.length;
  }

  get pgn() {
    return this.#pgn || (this.#pgn = pgn(this));
  }

  get snapshot() {
    return this.#snapshot || (this.#snapshot = this.#buildSnapshot());
  }

  transit(ply, result) {
    if (this.result) {
      throw new Error('game is already over.');
    }
    const { initialPosition, position, plies, tags } = this;
    return new Game({
      initialPosition,
      position: position.transit(ply),
      plies: [...plies, ply],
      tags,
      result,
    });
  }

  undo() {
    const ply = this.lastPly;
    const plies = this.plies.slice(0, -1);
    const meta = {};
    if (pids.isPiece(ply.captured)) {
      meta.clock = recoverClock(plies);
    }
    const { initialPosition, position, tags } = this;
    return new Game({
      initialPosition,
      position: position.undo(ply, meta),
      plies,
      tags,
    });
  }

  #buildSnapshot() {
    let { initialPosition, position, plies, result, tags } = this;
    initialPosition = initialPosition.snapshot;
    position = position.snapshot;
    plies = plies.map(ply => ply.code);
    return Object.freeze({ initialPosition, position, plies, result, tags });
  }

}

function pgn(game) {
  // TODO
  return '';
}

function recoverClock(plies) {
  let clock = 0;
  for (let i = plies.length - 1; i >= 0; i--) {
    if (pids.isPiece(plies[i].captured)) {
      break;
    }
    clock++;
  }
  return clock;
}