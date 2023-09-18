import * as COLOR from './color.js';
import * as colors from './colors.js';
import * as p from './piece.js';

const COLOR_BIT = 0x8;
const RED_MASK = 0x7;

const CHARS = 'AEHRCK-Paehrck-p';
//'-pcrheak-KAEHRCP';

const PID_SCHEMA = [
  { offset: 0, limit: 2 },
  { offset: 2, limit: 2 },
  { offset: 4, limit: 2 },
  { offset: 6, limit: 2 },
  { offset: 8, limit: 2 },
  { offset: 10, limit: 1 },
  {},
  { offset: 11, limit: 5 },
  { offset: 16, limit: 2 },
  { offset: 18, limit: 2 },
  { offset: 20, limit: 2 },
  { offset: 22, limit: 2 },
  { offset: 24, limit: 2 },
  { offset: 26, limit: 1 },
  {},
  { offset: 27, limit: 5 },
];

const CHAR_CODE_TO_CODE = Object.freeze({
  ['A'.charCodeAt()]: p.RA,
  ['a'.charCodeAt()]: p.BA,
  ['E'.charCodeAt()]: p.RE,
  ['e'.charCodeAt()]: p.BE,
  ['H'.charCodeAt()]: p.RH,
  ['h'.charCodeAt()]: p.BH,
  ['R'.charCodeAt()]: p.RR,
  ['r'.charCodeAt()]: p.BR,
  ['C'.charCodeAt()]: p.RC,
  ['c'.charCodeAt()]: p.BC,
  ['K'.charCodeAt()]: p.RK,
  ['k'.charCodeAt()]: p.BK,
  ['P'.charCodeAt()]: p.RP,
  ['p'.charCodeAt()]: p.BP,

  // compatible with alternative representation
  ['B'.charCodeAt()]: p.RE, // B for bishop -> elephant
  ['b'.charCodeAt()]: p.BE, 
  ['N'.charCodeAt()]: p.RH, // N for knight -> horse
  ['n'.charCodeAt()]: p.BH, 
});

export const ALL = Object.freeze([
  p.RA, p.RE, p.RH, p.RR, p.RC, p.RK, p.RP,
  p.BA, p.BE, p.BH, p.BR, p.BC, p.BK, p.BP,
]);

export function isEmpty(code) {
  return code < 0;
}

export function isPiece(code) {
  return code >= 0;
}

export function isRed(code) {
  return code >= 0 && code < COLOR_BIT;
}

export function isBlack(code) {
  return code >= COLOR_BIT;
}

// TODO: handle EM
export function color(code) {
  return code < COLOR_BIT ? COLOR.RED : COLOR.BLACK;
}

export function asRed(code) {
  return code < 0 ? code : code & RED_MASK;
}

export function asBlack(code) {
  return code | COLOR_BIT; // -1 | 0x8 = -1
}

export function mirror(code) {
  return code < 0 ? code : code ^ COLOR_BIT;
}

// offset //
/*
export const COUNTS = [
  //-7                -1
  0, 5, 2, 2, 2, 2, 2, 1,
  // 1                 7
  0, 1, 2, 2, 2, 2, 2, 5,
];

export const COUNT = COUNTS.reduce((acc, count) => acc + count, 0);

const OFFSETS = COUNTS.reduce((acc, count) => {
  acc[0].push(acc[1]);
  acc[1] += count;
  return acc;
}, [[], 0])[0];

const ID_TO_PIECE = COUNTS.reduce((arr, count, index) => {
  for (let i = 0; i < count; i++) {
    arr.push(index - 8);
  }
  return arr;
}, []);

export function count(code) {
  return COUNTS[code + 8];
}

export function offset(code) {
  return OFFSETS[code + 8];
}

export function fromId(id) {
  return ID_TO_PIECE[id];
}
*/

// char code //
export function encode(code) {
  return CHARS.charCodeAt(code);
}

export function decode(charCode) {
  const c = CHAR_CODE_TO_CODE[charCode];
  if (c === undefined) {
    throw new Error(`Unrecognized code point: ${charCode}`);
  }
  return c;
}

// string //
const EN_LABELS = [
  'advisor',
  'elephant',
  'horse',
  'rook',
  'cannon',
  'king',
  '',
  'pawn',
];

export function en(code) {
  return `${colors.en(color(code))} ${EN_LABELS[asRed(code)]}`;
}

export function format(code) {
  return CHARS.charAt(code);
}

export function parse(c) {
  return decode(c.charCodeAt());
}

export function pids() {
  const cursors = Array(16).fill(0);
  return Object.freeze({
    get(code) {
      const { offset, limit } = PID_SCHEMA[code];
      const c = cursors[code]++;
      if (c >= limit) {
        throw new Error(`Exceed piece limit (${limit}) for ${en(code)}`);
      }
      return offset + c;
    }
  });
}
