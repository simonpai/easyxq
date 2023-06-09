import { PIECE as p } from '../../constant/index.js';
import { hashBoard } from '../../helpers/index.js';
import * as boards from './boards.js';
import MirroredBoard from '../mirror/board.js';
import Pieces from './pieces.js';
import Ply from '../ply.js';
import PreviewBoard from '../preview/board.js';

export default class Board {

  static parse(notation) {
    return new Board(boards.parse(notation));
  }

  static load(snapshot) {
    const pieces = Pieces.load(snapshot);
    const array = boards.fromSquares(pieces);
    return new Board(array, { pieces });
  }

  #array;
  #notation;
  #pieces;
  #mirror;
  #hash;
  #meta;

  constructor(array, meta = {}) {
    this.#array = array;
    this.#meta = meta;
  }

  get notation() {
    return this.#notation || (this.#notation = boards.format(this.#array)); // use #array is faster
  }

  get hash() {
    if (this.#hash === undefined) {
      const { parent, hash, ply } = this.#meta;
      this.#hash = hash !== undefined ? hash : (parent !== undefined && ply) ? parent ^ ply.hash : hashBoard(this);
    }
    return this.#hash;
  }

  get pieces() {
    return this.#pieces || (this.#pieces = this.#meta.pieces || Pieces.fromBoard(this));
  }

  get mirror() {
    return this.#mirror || (this.#mirror = new MirroredBoard(this));
  }

  get snapshot() {
    return this.pieces.snapshot;
  }

  at(index) {
    return this.#array.at(index);
  }

  ply(from, to) {
    return new Ply(from, to, this.at(from), this.at(to));
  }

  preview(ply) {
    return new PreviewBoard(this, ply);
  }

  transit(ply) {
    if (!ply.pid) {
      ply = this.ply(ply.from, ply.to);
    }
    const { from, to } = ply;
    const array = boards.cloneArray(this.#array);
    array.fill(this.#array.at(from), to, to + 1);
    array.fill(p.EM, from, from + 1);
    // TODO: just compute hash here
    return new Board(array, {
      parent: this.hash,
      ply,
      pieces: this.pieces.transit(ply),
    });
  }

  undo(ply) {
    const { from, to, pid, captured } = ply;
    const array = boards.cloneArray(this.#array);
    array.fill(pid, from, from + 1);
    array.fill(captured, to, to + 1);
    return new Board(array, {
      hash: this.hash ^ ply.hash,
      pieces: this.pieces.undo(ply),
    });
  }

}
