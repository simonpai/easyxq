import { mixin, defineValues, randomInt } from '@easyxq/commons';
import { PIECE as p, pids, coordinates as c } from '../../constant/index.js';
import { hashBoard } from '../../helpers/index.js';
import * as boards from './boards.js';
import Pieces from './pieces.js';
import Ply from '../ply.js';

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

  _pieces;
  _hash;
  _mirror;
  _notation;

  constructor(array, { hash , pieces } = {}) {
    this.#array = array;
    this._pieces = pieces;
    this._hash = hash;
  }

  at(index) {
    return this.#array.at(index);
  }

  get pieces() {
    return this._pieces || (this._pieces = Pieces.fromBoard(this));
  }

  _computeHash() {
    return hashBoard(this);
  }

  _computeNotation() {
    return boards.format(this.#array); // use #array is faster
  }

  transit(ply) {
    if (!ply.pid) {
      ply = this.ply(ply.from, ply.to);
    }
    const { from, to } = ply;
    const array = boards.cloneArray(this.#array);
    array.fill(this.#array.at(from), to, to + 1);
    array.fill(p.EM, from, from + 1);
    return new Board(array, {
      hash: this.hash ^ ply.hash,
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

// mirror //
class MirroredBoard {

  static #hash;
  
  static get hash() {
    return MirroredBoard.#hash || (MirroredBoard.#hash = randomInt());
  }

  _hash;
  _mirror;
  _notation;

  constructor(board) {
    this._mirror = board;
    defineValues(this, {
      mirrored: true,
    });
  }

  at(index) {
    return pids.mirror(this._mirror.at(c.mirror(index)));
  }

  get pieces() {
    return this._mirror.pieces.mirror;
  }

  _computeHash() {
    return this._mirror.hash ^ MirroredBoard.hash;
  }

  get notation() {
    return this._notation || (this._notation = this._computeNotation());
  }

  _computeNotation() {
    const mirrored = this._mirror.notation;
    const length = mirrored.length;
    const chars = Array(length);
    for (let i = 0; i < length; i++) {
      const c = mirrored.charCodeAt(length - 1 - i);
      chars[i] = c > 64 ? c ^ 0x20 : c;
    }
    return String.fromCharCode(...chars);
  }

}

// preview //
class PreviewBoard {

  #parent;
  #ply;
  #materialized;

  _pieces;
  _hash;
  _mirror;

  constructor(parent, ply) {
    if (ply.pid === undefined) {
      ply = parent.ply(ply.from, ply.to);
    }
    this.#parent = parent;
    this.#ply = ply;
    defineValues(this, {
      previewing: true,
    });
  }

  at(sid) {
    const { from, to, pid } = this.#ply;
    return sid === from ? p.EM : sid === to ? pid : this.#parent.at(sid);
  }

  get pieces() {
    return this._pieces || (this._pieces = this.#parent.pieces.preview(this.#ply));
  }

  _computeHash() {
    return this.#parent.hash ^ this.#ply.hash;
  }

  get notation() {
    return this.commit().notation;
  }

  commit() {
    return this.#materialized || (this.#materialized = this.#parent.transit(this.#ply));
  }

  // TODO: transit = preview again + commit?

}

// mixin //
const props = {
  hash: {
    get() {
      return this._hash !== undefined ? this._hash : (this._hash = this._computeHash());
    }
  },
  notation: {
    get() {
      return this._notation || (this._notation = this._computeNotation());
    }
  },
  snapshot: {
    get() {
      return this.pieces.snapshot;
    }
  },
  ply: {
    value(from, to) {
      return new Ply(from, to, this.at(from), this.at(to));
    }
  },
  mirror: {
    get() {
      return this._mirror || (this._mirror = new MirroredBoard(this));
    }
  },
  preview: {
    value(ply) {
      return new PreviewBoard(this, ply);
    }
  },
};

for (const BoardClass of [Board, MirroredBoard, PreviewBoard]) {
  mixin(BoardClass, props);
}
