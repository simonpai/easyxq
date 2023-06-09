import { asArray } from '@easyxq/commons';
import * as fns from './functions.js';

export function install(Variable) {
  for (const [name, fn] of Object.entries(fns)) {
    Variable.prototype[name] = function(...options) {
      return new Variable(...asArray(fn(this, ...options)));
    };
  }
}
