import { RED, BLACK, BOTH } from './color.js';

const TEXT_TO_CODE = {
  [RED]: RED,
  [BLACK]: BLACK,
  r: RED,
  w: RED,
  b: BLACK,
  red: RED,
  white: RED,
  black: BLACK,
};

export function parse(c) {
  return TEXT_TO_CODE[c && c.toLowerCase()] || (() => {
    throw new Error(`Unrecognized color notation: ${c}.`);
  })();
}

export function format(color) {
  switch (color) {
    case RED:
      return 'r';
    case BLACK:
      return 'b';
  }
  throw new Error(`Unrecognized color code: ${color}.`);
}

export function en(color) {
  return validate(color) === RED ? 'red' : 'black';
}

export function zh(color) {
  return validate(color) === RED ? '紅' : '黑';
}

export function mirror(color) {
  // optimize
  return color === RED ? BLACK : color === BLACK ? RED : color === BOTH ? BOTH : (() => { throw new Error(`Invalid color code: ${color}`); })();
}

export function validate(color) {
  if (color === undefined) {
    throw new Error(`Color is required.`);
  }
  if (color < 1 || color > 2) {
    throw new Error(`Invalid color code: ${color}.`);
  }
  return color;
}

export function index(color) {
  return color - 1;
}
