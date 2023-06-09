import { sortBy } from '@easyxq/commons';

export function scale(variable, value) {
  return [(args) => variable.evaluate(args) * value, {
    explain: args => `(${variable.explain(args)})*${value}`,
  }];
}

export function filter(variable, predicate) {
  return args => predicate.test(args) ? variable.evaluate(args) : 0;
}

export function softbans(variable, bans) {
  sortBy(bans, bans => bans.maxScore || 0);
  return [(args) => {
    const score = variable.evaluate(args);
    for (const { predicate, maxScore } of bans) {
      if (predicate.test(args)) {
        return Math.min(maxScore, score);
      }
    }
    return score;
  }, {
    explain: args => {
      const score = variable.evaluate(args);
      for (const { predicate, maxScore } of bans) {
        if (predicate.test(args) && score > maxScore) {
          return `softbanned to ${maxScore}`;
        }
      }
      return variable.explain(args);
    }
  }];
}
