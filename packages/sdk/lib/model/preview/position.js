import { pids, colors, COLOR } from '../../constant/index.js';
import { hashPosition } from '../../helpers/index.js';

export default class PreviewPosition {

  #base;
  #ply;
  #board;
  #hash;

  constructor(base, ply) {
    this.#base = base;
    this.#ply = ply;
  }

  get board() {
    return this.#board || (this.#board = this.#base.board.preview(this.#ply));
  }

  get color() {
    return colors.mirror(this.#base.color);
  }

  get clock() {
    return pids.isEmpty(this.#ply.captured) ? 0 : this.#base.clock + 1;
  }

  get moveNum() {
    return this.#base.color === COLOR.BLACK ? this.#base.moveNum + 1 : this.#base.moveNum;
  }

  get isPreview() {
    return true;
  }

  get fen() {
    return Reflect.get(this.#base, 'fen', this);
  }

  get hash() {
    return this.#hash || (this.#hash = hashPosition(this));
  }

  ply(from, to) {
    return this.board.ply(from, to);
  }

  preview(ply) {
    return new PreviewPosition(this, ply);
  }

}
