import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { pids } from '../lib/constant/index.js';

function range(start, end, repeat = 1) {
  const array = [];
  for (let value = start; value < end; value++) {
    for (let j = 0; j < repeat; j++) {
      array.push(value);
    }
  }
  return array;
}

const PIDS = range(0, 32);

const AS_REDS = [...range(0, 16), ...range(0, 16)];
const MIRROR = [...range(16, 32), ...range(0, 16)];
const PIECES = [...range(0, 5, 2), 5, ...range(7, 8, 5), ...range(8, 13, 2), 13, ...range(15, 16, 5)];

// tests //
test('as red', () => {
  assert.equal(PIDS.map(pids.asRed), AS_REDS);
});

test('mirror', () => {
  assert.equal(PIDS.map(pids.mirror), MIRROR);
});

test('piece', () => {
  assert.equal(PIDS.map(pids.piece), PIECES);
});

test.run();
