import { defineValues } from '@easyxq/commons';
import { COLOR } from '../../constant/index.js';
import PiecesCore from './pieces-core.js';
import PiecesKing from './pieces-king.js';

export default class Pieces {

  static fromBoard(board) {
    return new Pieces(PiecesCore.fromBoard(board));
  }

  static load(snapshot) {
    return new Pieces(PiecesCore.load(snapshot));
  }

  #core;
  #mirror;

  constructor(core) {
    this.#core = core;
    defineValues(this, {
      KING: new PiecesKing(core),
    });
  }

  *[Symbol.iterator]() {
    yield* this.#core.slice(0, 32);
  }

  get(pid) {
    return this.#core.get(pid);
  }

  get RED() {
    return this.#core.slice(0, 16);
  }

  get BLACK() {
    return this.#core.slice(16, 32);
  }

  ofColor(color) {
    return color === COLOR.RED ? this.RED : this.BLACK;
  }

  get mirror() {
    return this.#mirror || (this.#mirror = new Pieces(this.#core.mirror));
  }

  get snapshot() {
    return this.#core.snapshot;
  }

  preview(ply) {
    return new Pieces(this.#core.preview(ply));
  }

  transit(ply) {
    return new Pieces(this.#core.transit(ply));
  }

  undo(ply) {
    return new Pieces(this.#core.undo(ply));
  }

}
