export default class PseudoRandom {

  #state;

  constructor(seed) {
    this.#state = (seed || randomSeed()) | 0;
  }

  #next() {
    this.#state = (this.#state | 0) + 0x9e3779b9 | 0;
  }

  get state() {
    return this.#state;
  }

  nextUint32() {
    this.#next();
    let t = this.#state ^ this.#state >>> 16; t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
    return (t = t ^ t >>> 15) >>> 0;
  }

  next() {
    return this.nextUint32() / 4294967296;
  }

  nextInt32() {
    return this.nextUint32() | 0;
  }

  nextInt(upperBound) {
    return (this.next() * upperBound) | 0;
  }

  select(array) {
    return array[this.nextInt(array.length)];
  }

  shuffle(array) {
    // Fisher–Yates
    for (let i = array.length; i > 1;) {
      const j = this.nextInt(i);
      i--;
      if (i !== j) {
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    return array;
  }

  clone() {
    return new PseudoRandom(this.#state);
  }

}

function randomSeed() {
  return Math.floor(Math.random() * 4294967296);
}

/*
function splitmix32(a) {
  return function() {
    a |= 0; a = a + 0x9e3779b9 | 0;
    var t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}
*/
