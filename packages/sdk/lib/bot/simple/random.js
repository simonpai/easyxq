import { GameContext } from '../../room/index.js';
import { randomItem } from '../../helpers/index.js';

export default class RandomEngine {

  #context;

  constructor({ rules } = {}) {
    this.#context = new GameContext({ rules });
  }

  async next(game) {
    const plies = this.#context.queries(game.position).nextLegalPlies;
    const groups = Object.values(plies.reduce((groups, ply) => {
      const key = `${ply.pid}`;
      (groups[key] = groups[key] || []).push(ply);
      return groups;
    }, {}));

    return randomItem(randomItem(groups));
  }

}
