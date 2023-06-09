import { defineValues } from '@easyxq/commons';
import { pids, coordinates as c } from '../constant/index.js';
import { hashPly } from '../helpers/index.js';

function toCode(from, to, pid, captured) {
  return pid | (from << 6) | (to << 14) | ((captured < 0 ? 0x3f : captured) << 22);
}

export default class Ply {

  #hash;

  static decode(code) {
    const pid = code & 0x3f;
    const from = (code >> 6) & 0xff;
    const to = (code >> 14) & 0xff;
    let captured = (code >> 22) & 0x3f;
    captured = captured === 0x3f ? -1 : captured;
    return new Ply(from, to, pid, captured);
  }

  constructor(from, to, pid, captured) {
    const code = toCode(from, to, pid, captured);
    defineValues(this, { from, to, pid, captured, code });
  }

  get color() {
    return pids.color(this.pid);
  }

  get mirror() {
    return new Ply(
      c.mirror(this.from),
      c.mirror(this.to),
      pids.mirror(this.pid),
      pids.mirror(this.captured)
    );
  }

  get hash() {
    if (this.#hash === undefined) {
      this.#hash = hashPly(this);
    }
    return this.#hash;
  }

  toString() {
   return `${pids.format(this.pid)}/${c.format(this.from)}${c.format(this.to)}` + (pids.isPiece(this.captured) ? `/${pids.format(this.captured)}` : '');
  }

}
