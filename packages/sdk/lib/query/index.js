import * as impl from './implementation.js';

const KEYS = Object.keys(impl);

function createCache() {
  return KEYS.reduce((cache, key) => {
    cache[key] = undefined;
    return cache;
  }, {});
}

export default class Queries {

  #position;
  #rules;
  #cache;

  constructor(rules, position) {
    this.#rules = rules;
    this.#position = position;
    this.#cache = createCache();
  }

  get nextPlies() {
    return this.#cache.nextPlies || (this.#cache.nextPlies = impl.nextPlies(this.#rules, this.#position));
  }

  get nextLegalPlies() {
    return this.#cache.nextLegalPlies || (this.#cache.nextLegalPlies = impl.nextLegalPlies(this.#rules, this.#position));
  }

  get hasLegalPly() {
    return this.#cache.hasLegalPly || (this.#cache.hasLegalPly = impl.hasLegalPly(this.#rules, this.#position));
  }

  get isInCheck() {
    return this.#cache.isInCheck || (this.#cache.isInCheck = impl.isInCheck(this.#rules, this.#position));
  }

  get calls() {
    return this.#cache.calls || (this.#cache.calls = impl.calls(this.#rules, this.#position));
  }

  get result() {
    return this.#cache.result || (this.#cache.result = impl.result(this.#rules, this.#position));
  }

  /**
   * It's impossible to have a player in check after their own move. This query is only used to detect illigal moves.
   */
  get anyCheckToPreviousPlayersKing() {
    return this.#cache.anyCheckToPreviousPlayersKing || (this.#cache.anyCheckToPreviousPlayersKing = impl.anyCheckToPreviousPlayersKing(this.#rules, this.#position));
  }

}
