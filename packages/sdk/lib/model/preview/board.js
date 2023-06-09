import { PIECE as p } from '../../constant/index.js';
import * as boards from '../board/boards.js';
import MirroredBoard from '../mirror/board.js';
import Ply from '../ply.js';

export default class PreviewBoard {

  #parent;
  #ply;
  #notation;
  #pieces;
  #mirror;

  constructor(parent, ply) {
    if (!ply.pid) {
      ply = parent.ply(ply.from, ply.to);
    }
    this.#parent = parent;
    this.#ply = ply;
  }

  get isPreview() {
    return true;
  }

  get notation() {
    return this.#notation || (this.#notation = boards.format(this));
  }

  get hash() {
    return this.#parent.hash ^ this.#ply.hash;
  }

  get pieces() {
    return this.#pieces || (this.#pieces = this.#parent.pieces.preview(this.#ply));
  }

  get mirror() {
    return this.#mirror || (this.#mirror = new MirroredBoard(this));
  }

  at(sid) {
    const { from, to, pid } = this.#ply;
    return sid === from ? p.EM : sid === to ? pid : this.#parent.at(sid);
  }

  commit() {
    return this.#parent.transit(this.#ply);
  }

  // TODO: can we mixin these?
  ply(from, to) {
    return new Ply(from, to, this.at(from), this.at(to));
  }

  preview(ply) {
    return new PreviewBoard(this, ply);
  }

  // TODO: transit = preview again + commit?

}
