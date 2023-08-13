import { shuffle, sortBy } from '@easyxq/commons';
import { GameContext } from '../../room/index.js';
import Input from './input.js';

export default class HeuristicRandomEngine {

  #context;
  #config;
  #heuristic;
  #debug;

  constructor({ config, heuristic } = {}, { debug } = {}) {
    const { rules } = config;
    this.#context = new GameContext({ rules });
    this.#config = config || {};
    this.#heuristic = heuristic || (() => 0);
    this.#debug = debug;
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
        const { preferences = {} } = this.#config;
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
    const entry = this.#select(entries);

    this.#log(input, winningPly ? Infinity : entries[0].score, entry);

    return entry.ply;
  }

  #evaluate(input) {
    return Math.round(this.#heuristic.evaluate(input));
  }

  #select(entries) {
    const rate = 0.5;
    const minLevel = 1;
    for (const entry of entries) {
      const { score } = entry;
      if (Math.random() > rate ** Math.max(minLevel, score / 100)) {
        return entry;
      }
    }
    return entries[entries.length - 1];
  }

  #log(input, max, entry) {
    if (!this.#debug) {
      return;
    }
    // TODO
    const { ply } = entry;
    this.#debug(input.before.fen, input.lastPlies.map(ply => ply.code));
    this.#debug(`${ply}: ${formatScore(entry.score)} ${entry.score === max ? '(best)' : `(best = ${formatScore(max)})`} = ${this.#heuristic.explain(new Input({ ...input, ply }))}`);
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
