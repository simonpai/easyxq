import Variable from '../variable.js';

export function variable(name, fn, props = {}) {
  return new Variable(fn, { name, ...props });
}
