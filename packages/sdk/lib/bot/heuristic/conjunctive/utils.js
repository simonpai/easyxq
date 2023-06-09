import Variable from '../variable.js';

export function variable(fn, props = {}) {
  return new Variable(fn, props);
}
