import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { FEN } from '../lib/constant/index.js';
import { Board } from '../lib/model/index.js';
import { hashBoard } from '../lib/helpers/index.js';

// tests //
test('standard', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  assert.equal(hashBoard(board), hashBoard(board));
});

test.run();
