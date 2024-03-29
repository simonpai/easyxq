import Variable from '../variable.js';

// TODO: a special variable that eats scale() and filter()

export function zero() {
  return ZERO;
}

const ZERO = new Variable(() => 0, {
  name: 'zero',
  zero: true,
  filter() {
    return this;
  },
  scale() {
    return this;
  },
});

export function constant(value) {
  return new Variable(() => value, {
    name: String(value),
    zero: value === 0,
  });
}
