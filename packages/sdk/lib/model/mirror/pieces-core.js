import { pids, coordinates as c } from '../../constant/index.js';

export default class MirroredPiecesCore {

  #core;

  constructor(core) {
    this.#core = core;
  }

  get(pid) {
    return c.mirror(this.#core.get(pids.mirror(pid)));
  }

  *slice(start, end) {
    if (start >= end) {
      return;
    }
    if (start === 0 && end === 32 || start >= 16 || end < 16) {
      for (const sq of this.#core.slice(0, 32)) {
        yield sq.mirror;
      }
    } else if (start >= 16 || end < 16) {
      for (const sq of this.#core.slice(pids.mirror(start), pids.mirror(end))) {
        yield sq.mirror;
      }
    } else {
      for (const sq of this.#core.slice(0, pids.mirror(end))) {
        yield sq.mirror;
      }
      for (const sq of this.#core.slice(pids.mirror(start), 32)) {
        yield sq.mirror;
      }
    }
  }

  transit(ply) {
    return this.#core.transit(ply.mirror).mirror;
  }

}
