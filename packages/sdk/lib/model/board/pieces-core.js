import { arrayBufferToBase64, base64ToArrayBuffer } from '@easyxq/commons';
import { pids, coordinates as c } from '../../constant/index.js';
import Square from '../square.js';
import MirroredPiecesCore from '../mirror/pieces-core.js';
import PreviewPiecesCore from '../preview/pieces-core.js';

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
  #mirror;

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

  get mirror() {
    return this.#mirror || (this.#mirror = new MirroredPiecesCore(this));
  }

  get snapshot() {
    return this.#snapshot || (this.#snapshot = arrayBufferToBase64(this.#array.buffer));
  }

  preview(ply) {
    return new PreviewPiecesCore(this, ply);
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
