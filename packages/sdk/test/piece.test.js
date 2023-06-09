import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { COLOR, pieces } from '../lib/constant/index.js';

const { RED, BLACK } = COLOR;

//                       0            
//                       AEHRCK-Paehrck-p
const FLAG_IS_EMPTY = 0b10000000000000000;
const FLAG_IS_RED   = 0b01111111100000000;
const FLAG_IS_BLACK = 0b00000000011111111;
const FLAS_IS_PIECE = FLAG_IS_RED | FLAG_IS_BLACK;

const CHARS = 'AEHRCKPaehrckp';

function mapToBinaryFlags(fn) {
  let flag = 0;
  for (let code = -1; code < 16; code++) {
    flag <<= 1;
    if (fn(code)) {
      flag |= 0x1;
    }
  }
  return str(flag);
}

function str(num) {
  return num.toString(2).padStart(17, '0');
}

// tests //
test('colors', () => {
  assert.equal(mapToBinaryFlags(pieces.isEmpty), str(FLAG_IS_EMPTY));
  assert.equal(mapToBinaryFlags(pieces.isRed), str(FLAG_IS_RED));
  assert.equal(mapToBinaryFlags(pieces.isBlack), str(FLAG_IS_BLACK));
  assert.equal(mapToBinaryFlags(pieces.isPiece), str(FLAS_IS_PIECE));
  assert.equal(mapToBinaryFlags(code => pieces.isPiece(code) && pieces.color(code) === RED), str(FLAG_IS_RED));
  assert.equal(mapToBinaryFlags(code => pieces.isPiece(code) && pieces.color(code) === BLACK), str(FLAG_IS_BLACK));
});

test('format', () => {
  assert.equal(CHARS.split('').map(ch => pieces.format(pieces.parse(ch))).join(''), CHARS);
});

test.run();
