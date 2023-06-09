import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { FEN, COLOR } from '../lib/constant/index.js';
import { Board } from '../lib/model/index.js';
import { findPlies } from '../lib/helpers/find-plies.js';

const RED_MOVES = 'A/d0e1:A/f0e1:C/b2a2:C/b2b1:C/b2b3:C/b2b4:C/b2b5:C/b2b6:C/b2b9/h:C/b2c2:C/b2d2:C/b2e2:C/b2f2:C/b2g2:C/h2c2:C/h2d2:C/h2e2:C/h2f2:C/h2g2:C/h2h1:C/h2h3:C/h2h4:C/h2h5:C/h2h6:C/h2h9/h:C/h2i2:E/c0a2:E/c0e2:E/g0e2:E/g0i2:H/b0a2:H/b0c2:H/h0g2:H/h0i2:K/e0e1:P/a3a4:P/c3c4:P/e3e4:P/g3g4:P/i3i4:R/a0a1:R/a0a2:R/i0i1:R/i0i2';
const BLACK_MOVES = 'a/f9e8:a/d9e8:e/g9i7:e/g9e7:e/c9e7:e/c9a7:h/h9i7:h/h9g7:h/b9c7:h/b9a7:r/i9i8:r/i9i7:r/a9a8:r/a9a7:c/h7h6:c/h7h5:c/h7h4:c/h7h3:c/h7h0/H:c/h7h8:c/h7i7:c/h7g7:c/h7f7:c/h7e7:c/h7d7:c/h7c7:c/b7b6:c/b7b5:c/b7b4:c/b7b3:c/b7b0/H:c/b7b8:c/b7c7:c/b7d7:c/b7e7:c/b7f7:c/b7g7:c/b7a7:k/e9e8:p/i6i5:p/g6g5:p/e6e5:p/c6c5:p/a6a5';

// tests //
test('standard', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  const redMoves = new Set([...findPlies({ board, color: COLOR.RED })].map(ply => `${ply}`));
  const mirroredBlackMoves = new Set([...findPlies({ board, color: COLOR.BLACK })].map(ply => `${ply.mirror}`));

  const SET = new Set(RED_MOVES.split(':'));
  assert.equal(redMoves, SET);
  assert.equal(mirroredBlackMoves, SET);
});

test('black', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  const blackMoves = new Set([...findPlies({ board, color: COLOR.BLACK })].map(ply => `${ply}`));
  const mirroredRedMoves = new Set([...findPlies({ board, color: COLOR.RED })].map(ply => `${ply.mirror}`));

  const SET = new Set(BLACK_MOVES.split(':'));
  assert.equal(blackMoves, SET);
  assert.equal(mirroredRedMoves, SET);
});

test.run();
