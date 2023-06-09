import BaseRules from './base.js';

const BUILT_IN_RULES = [
  BaseRules,
];

const RULES_MAP = BUILT_IN_RULES.reduce((map, rule) => {
  map[rule.name] = rule;
  return map;
}, {});

function create(rule) {
  if (typeof rule === 'string') {
    rule = RULES_MAP[rule];
  }
  if (typeof rule === 'function') {
    rule = new rule();
  }
  return rule;
}

export default class Rules {

  #rules;

  constructor(rules) {
    this.#rules = rules.map(create);
  }

  *[Symbol.iterator]() {
    for (const rule of this.#rules) {
      // TODO: yield name only
      yield rule;
    }
  }

  *apply(name, params) {
    for (const rule of this.#rules) {
      if (!rule[name]) {
        continue;
      }
      yield* rule[name](params);
    }
  }

}
