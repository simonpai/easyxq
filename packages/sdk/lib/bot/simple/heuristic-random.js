import { GameContext } from '../../room/index.js';
import { searchIndex } from '../../helpers/index.js';
import Input from './input.js';

export default class HeuristicRandomEngine {

  #context;
  #heuristic;

  constructor({ rules, heuristic } = {}) {
    this.#context = new GameContext({ rules });
    this.#heuristic = heuristic || (() => 0);
  }

  async next({ position, plies }) {
    const context = this.#context;
    const candidates = context.queries(position).nextLegalPlies;
    const lastPlies = plies.slice(-2);
    lastPlies.reverse();

    
    let input = {
      context,
      lastPlies,
      before: position,
    };
    input.t = createTools(input);

    let i = 0;
    let max = -Infinity;
    let sum = 0;
    const thresholds = [];
    const entries = [];
    for (const ply of candidates) {
      const score = this.#evaluate(new Input({ ...input, ply }));
      if (score > max) {
        max = score;
      }
      sum += 2 ** (score / 10);
      thresholds.push(sum);
      entries.push({
        index: i++,
        score,
        ply,
      });
    }

    const index = searchIndex(thresholds, Math.random() * sum);
    const entry = entries[index];
    const { ply } = entry;

    console.log(position.fen, lastPlies.map(ply => ply.code));
    console.log(`${ply}: ${entry.score}${entry.score === max ? ' (best)' : `(best = ${max})`} = ${this.#heuristic.explain(new Input({ ...input, ply }))}`);

    return ply;
  }

  #evaluate(input) {
    return Math.round(this.#heuristic.evaluate(input));
  }

}

function createTools(input) {
  const cache = new Map();
  return {
    memoize(key, fn) {
      if (cache.has(key)) {
        return cache.get(key);
      }
      const value = fn(input);
      cache.set(key, value);
      return value;
    }
  }
}
