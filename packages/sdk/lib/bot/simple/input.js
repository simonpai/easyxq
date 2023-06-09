import { colors } from '../../constant/index.js';

export default class Input {

  #after;

  constructor(args) {
    Object.assign(this, args);
    Object.freeze(this);
  }

  get me() {
    return this.before.color;
  }

  get opponent() {
    return colors.mirror(this.me);
  }

  get after() {
    return this.#after || (this.#after = this.before.preview(this.ply));
  }

}
