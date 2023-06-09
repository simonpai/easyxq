import Variable from './variable.js';
import { install } from './decorative/index.js';
export * from './conjunctive/index.js';
export * from './fundamental/index.js';
export * from './predicate/index.js';
export * as values from './values.js';

install(Variable);
