import { zero, constant } from '../fundamental/constants.js';
import Variable from '../variable.js';

export function sum(...variables) {
  variables = variables.filter(variable => !variable.zero);
  const len = variables.length;
  return len === 0 ? zero() : len === 1 ? variables[0] : v((input) => {
    let sum = 0;
    for (const variable of variables) {
      const score = variable.evaluate(input);
      if (score === Infinity) {
        return score; // shortcut for win()
      }
      sum += score;
    }
    return sum;
  }, {
    explain: input => variables.map(variable => variable.explain(input)).join(' + '),
  });
}

export function max(...variables) {
  variables = variables.filter(variable => !variable.zero);
  const len = variables.length;
  return len === 0 ? constant(-Infinity) : len === 1 ? variables[0] : v((input) => {
    let max = -Infinity;
    for (const variable of variables) {
      const value = variable.evaluate(input);
      if (value === Infinity) {
        return value;
      }
      if (value > max) {
        max = value;
      }
    }
    return max;
  }, {
    explain: input => `max(${variables.map(variable => variable.explain(input)).join(', ')})`,
  });
}

function v(fn, props) {
  return new Variable(fn, props);
}
