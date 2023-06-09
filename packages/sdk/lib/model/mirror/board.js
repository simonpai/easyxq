import { defineValues } from '@easyxq/commons';
import { pids, coordinates as c } from '../../constant/index.js';
import { randomInt } from '../../helpers/index.js';

let _mirrorHash;

function mirrorHash() {
  return _mirrorHash || (_mirrorHash = randomInt());
}

export default class MirroredBoard {

  #original;
  #notation;
  #hash;

  constructor(original) {
    this.#original = original;
    this.#hash = this.#original.hash ^ mirrorHash();
    defineValues(this, {
      mirrored: true,
    });
  }

  get notation() {
    return this.#notation || (this.#notation = this.#buildNotation());
  }

  get hash() {
    return this.#hash;
  }

  get pieces() {
    return this.#original.pieces.mirror;
  }

  get mirror() {
    return this.#original;
  }

  at(index) {
    return pids.mirror(this.#original.at(c.mirror(index)));
  }

  ply(from, to) {
    return this.#original.ply(c.mirror(from), c.mirror(to)).mirror;
  }

  #buildNotation() {
    const original = this.#original.notation;
    const length = original.length;
    const chars = Array(length);
    for (let i = 0; i < length; i++) {
      const c = original.charCodeAt(length - 1 - i);
      chars[i] = c > 64 ? c ^ 0x20 : c;
    }
    return String.fromCharCode(...chars);
  }

}
