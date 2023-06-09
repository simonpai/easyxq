import { coordinates as c } from '../../constant/index.js';
import MirroredPiecesCore from '../mirror/pieces-core.js';
import Square from '../square.js';

export default class PreviewPiecesCore {

  #core;
  #ply;
  #mirror;

  constructor(core, ply) {
    this.#core = core;
    this.#ply = ply;
  }

  get(pid) {
    const { to, pid: plyPid, captured } = this.#ply;
    return pid === plyPid ? to : pid === captured ? c.UNAVAILABLE : this.#core.get(pid);
  }

  *slice(start, end) {
    const { to, pid, captured } = this.#ply;
    for (const sq of this.#core.slice(start, end)) {
      if (sq.pid === pid) {
        yield new Square(to, pid);
      } else if (sq.pid !== captured) {
        yield sq;
      }
    }
  }

  get mirror() {
    return this.#mirror || (this.#mirror = new MirroredPiecesCore(this));
  }

  preview(ply) {
    return new PreviewPiecesCore(this, ply);
  }

}
