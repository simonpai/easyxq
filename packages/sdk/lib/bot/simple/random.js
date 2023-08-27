import { PseudoRandom } from '@easyxq/commons';
import { GameContext } from '../../room/index.js';

export default class RandomEngine {

  #context;

  constructor({ rules } = {}) {
    this.#context = new GameContext({ rules });
  }

  async next(game, seed) {
    const random = new PseudoRandom(seed);
    const plies = this.#context.queries(game.position).nextLegalPlies;
    const groups = Object.values(plies.reduce((groups, ply) => {
      const key = `${ply.pid}`;
      (groups[key] = groups[key] || []).push(ply);
      return groups;
    }, {}));

    return random.select(random.select(groups));
  }

}
