import { COLOR } from '../../constant/index.js';

export default class PiecesKing {

  #core;

  constructor(core) {
    this.#core = core;
  }

  get RED() {
    return this.#core.get(10);
  }

  get BLACK() {
    return this.#core.get(26);
  }

  of(color) {
    return color === COLOR.RED ? this.RED : this.BLACK;
  }

}
