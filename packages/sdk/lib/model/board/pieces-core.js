import { arrayBufferToBase64, base64ToArrayBuffer, mixin } from '@easyxq/commons';
import { pids, coordinates as c } from '../../constant/index.js';
import Square from '../square.js';

function updateArray(array, pid, sid) {
  array.fill(sid, pid, pid + 1);
}

export default class PiecesCore {

  static fromBoard(board) {
    const array = new Uint8Array(32);
    array.fill(c.UNAVAILABLE);
    for (let sid = 0; sid >= 0; sid = c.next(sid)) {
      const pid = board.at(sid);
      if (pids.isEmpty(pid)) {
        continue;
      }
      updateArray(array, pid, sid);
    }
    return new PiecesCore(array);
  }

  static load(snapshot) {
    return new PiecesCore(new Uint8Array(base64ToArrayBuffer(snapshot)));
  }

  #array;
  #snapshot;

  constructor(array) {
    this.#array = array;
  }

  get(pid) {
    return this.#array.at(pid);
  }

  *slice(start, end) {
    for (let pid = start; pid < end; pid++) {
      const sid = this.#array.at(pid);
      if (sid !== c.UNAVAILABLE) {
        yield new Square(sid, pid);
      }
    }
  }

  get snapshot() {
    return this.#snapshot || (this.#snapshot = arrayBufferToBase64(this.#array.buffer));
  }

  transit(ply) {
    const array = new Uint8Array(this.#array);
    const { to, pid, captured } = ply;
    // find moved piece
    updateArray(array, pid, to);
    // find captured piece if any
    if (pids.isPiece(captured)) {
      updateArray(array, captured, c.UNAVAILABLE);
    }
    return new PiecesCore(array);
  }

  undo(ply) {
    const array = new Uint8Array(this.#array);
    const { from, to, pid, captured } = ply;
    // find moved piece
    updateArray(array, pid, from);
    // find captured piece if any
    if (pids.isPiece(captured)) {
      updateArray(array, captured, to);
    }
    return new PiecesCore(array);
  }

}

// mirror //
class MirroredPiecesCore {

  constructor(core) {
    this._mirror = core;
  }

  get(pid) {
    return c.mirror(this._mirror.get(pids.mirror(pid)));
  }

  *slice(start, end) {
    if (start >= end) {
      return;
    }
    if (start === 0 && end === 32 || start >= 16 || end < 16) {
      for (const sq of this._mirror.slice(0, 32)) {
        yield sq.mirror;
      }
    } else if (start >= 16 || end < 16) {
      for (const sq of this._mirror.slice(pids.mirror(start), pids.mirror(end))) {
        yield sq.mirror;
      }
    } else {
      for (const sq of this._mirror.slice(0, pids.mirror(end))) {
        yield sq.mirror;
      }
      for (const sq of this._mirror.slice(pids.mirror(start), 32)) {
        yield sq.mirror;
      }
    }
  }

  transit(ply) {
    return this._mirror.transit(ply.mirror).mirror;
  }

  get snapshot() {
    // TODO
    throw new Error('Not implemented');
  }

}

// preview //
class PreviewPiecesCore {

  #parent;
  #ply;

  constructor(parent, ply) {
    this.#parent = parent;
    this.#ply = ply;
  }

  get(pid) {
    const { to, pid: plyPid, captured } = this.#ply;
    return pid === plyPid ? to : pid === captured ? c.UNAVAILABLE : this.#parent.get(pid);
  }

  *slice(start, end) {
    const { to, pid, captured } = this.#ply;
    for (const sq of this.#parent.slice(start, end)) {
      if (sq.pid === pid) {
        yield new Square(to, pid);
      } else if (sq.pid !== captured) {
        yield sq;
      }
    }
  }

  get snapshot() {
    // TODO
    throw new Error('Not implemented');
  }

}

// mixin //
const props = {
  mirror: {
    get() {
      return this._mirror || (this._mirror = new MirroredPiecesCore(this));
    }
  },
  preview: {
    value(ply) {
      return new PreviewPiecesCore(this, ply);
    }
  },
};

for (const PiecesCoreClass of [PiecesCore, MirroredPiecesCore, PreviewPiecesCore]) {
  mixin(PiecesCoreClass, props);
}
