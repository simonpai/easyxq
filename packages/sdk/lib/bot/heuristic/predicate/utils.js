export class Predicate {

  constructor(fn) {
    this._fn = fn;
  }

  test(args) {
    return this._fn(args);
  }

  get negate() {
    return new Predicate((args) => !this.test(args));
  }

}

export function predicate(fn) {
  return new Predicate(fn);
}

const T = predicate(() => true);
const F = predicate(() => false);

export function t() {
  return T;
}

export function f() {
  return F;
}

export function and(...predicates) {
  const len = predicates.length;
  return len === 0 ? T : len === 1 ? predicates[0] : predicate(args => predicates.every(predicate => predicate.test(args)));
}

export function or(...predicates) {
  const len = predicates.length;
  return len === 0 ? F : len === 1 ? predicates[0] : predicate(args => predicates.some(predicate => predicate.test(args)));
}
