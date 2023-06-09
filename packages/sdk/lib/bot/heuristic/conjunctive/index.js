import { zero } from '../fundamental/zero.js';
import Variable from '../variable.js';

export function sum(...variables) {
  variables = variables.filter(variable => !variable.zero);
  const len = variables.length;
  return len === 0 ? zero() : len === 1 ? variables[0] : v((input) => variables.reduce((sum, variable) => sum + variable.evaluate(input), 0), {
    explain: input => variables.map(variable => variable.explain(input)).join(' + '),
  });
}

function v(fn, props) {
  return new Variable(fn, props);
}
