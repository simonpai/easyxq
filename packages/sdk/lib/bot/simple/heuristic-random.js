import { shuffle, sortBy } from '@easyxq/commons';
import { GameContext } from '../../room/index.js';
import Input from './input.js';

export default class HeuristicRandomEngine {

  #context;
  #config;
  #heuristic;

  constructor({ config, heuristic } = {}) {
    const { rules } = config;
    this.#context = new GameContext({ rules });
    this.#config = config || {};
    this.#heuristic = heuristic || (() => 0);
  }

  async next({ position, plies }) {
    const context = this.#context;
    const nextPlies = shuffle(context.queries(position).nextLegalPlies);
    const lastPlies = plies.slice(-2);
    lastPlies.reverse();
    
    let input = {
      context,
      lastPlies,
      before: position,
    };
    input.t = createTools(input);

    let winningPly;
    let useWinningPly = false;
    const entries = [];
    for (const ply of nextPlies) {
      const score = this.#evaluate(new Input({ ...input, ply }));
      if (score === Infinity) { // win
        const { preferences } = this.#config;
        if (winningPly) {
          continue;
        }
        winningPly = ply;
        if (Math.random() < (preferences.win || 1)) {
          useWinningPly = true;
          break;
        }
      }
      entries.push({
        score,
        ply,
      });
    }
    if (winningPly && (useWinningPly || entries.length === 0)) {
      this.#log(input, Infinity, { ply: winningPly, score: Infinity });
      return winningPly;
    }

    sortBy(entries, en => -en.score);
    const index = Math.min(Math.floor(-Math.log2(Math.random())), entries.length - 1);
    const entry = entries[index];

    this.#log(input, winningPly ? Infinity : entries[0].score, entry);

    return entry.ply;
  }

  #evaluate(input) {
    return Math.round(this.#heuristic.evaluate(input));
  }

  #log(input, max, entry) {
    // TODO
    const { ply } = entry;
    console.log(input.before.fen, input.lastPlies.map(ply => ply.code));
    console.log(`${ply}: ${formatScore(entry.score)} ${entry.score === max ? '(best)' : `(best = ${formatScore(max)})`} = ${this.#heuristic.explain(new Input({ ...input, ply }))}`);
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

function formatScore(value) {
  return value === Infinity ? 'win' : `${value}`;
}
