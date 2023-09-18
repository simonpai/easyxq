import { RULE, calls as _calls, zh } from '../constant/index.js';
import Queries from '../query/index.js';
import { Rules } from '../rule/index.js';

export default class GameContext {

  #rules;

  constructor({ rules = [RULE.BASE] } = {}) {

    this.#rules = new Rules(rules);

    for (const rule of this.#rules) {
      rule.initialize(this);
    }
  }

  get rules() {
    return this.#rules;
  }

  queries(position) {
    return new Queries(this.#rules, position);
  }

  transit(position, from, to) {
    const { rules } = this;
    let calls = [...rules.apply('preMove', { position, from, to })];

    const ply = position.ply(from, to);
    const notation = zh.formatPly(position, ply);
    const preview = position.preview(ply);

    calls = [...calls, ...rules.apply('preTransit', { position, ply, preview })];

    position = position.transit(ply);

    calls = [...calls, ...rules.apply('postTransit', { position, ply })];

    return [position, ply, calls, notation];
  }

}
