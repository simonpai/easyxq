import { COLOR } from '../../constant/index.js';
import PiecesCore from './pieces-core.js';

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
  }

  *[Symbol.iterator]() {
    yield* this.#core.slice(0, 32);
  }

  get(pid) {
    return this.#core.get(pid);
  }

  // TODO: shall we return iterable?

  get RED() {
    return this.#core.slice(0, 16);
  }

  get BLACK() {
    return this.#core.slice(16, 32);
  }

  get RED_PAWNS() {
    return this.#core.slice(11, 16);
  }

  get BLACK_PAWNS() {
    return this.#core.slice(27, 32);
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
