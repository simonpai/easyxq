import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { FEN } from '../lib/constant/index.js';
import { Board } from '../lib/model/index.js';

function piecesSet(pieces) {
  return new Set([...pieces].map(sq => `${sq}`));
}

// tests //
test('notation', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  assert.equal(board.notation, notation);
});

/*
test('kings', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  assert.equal(board.pieces.KING.RED, 0x04);
  assert.equal(board.pieces.KING.BLACK, 0x94);
});
*/

test('pieces', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  let sum = 0;
  for (const { sid } of board.pieces) {
    sum += sid;
  }
  assert.equal(sum, 0x98 * 16);
});

test('transit', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  const ply1 = { from: 0x01, to: 0x22 };
  const ply2 = { from: 0x07, to: 0x26 };
  assert.equal(board.transit(ply1).transit(ply2).notation, board.transit(ply2).transit(ply1).notation);
});

test('mirror', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  assert.equal(board.mirror.mirror, board);
  assert.equal(board.mirror.notation, notation);
  //assert.equal(board.mirror.pieces.KING.RED, 0x04);
  //assert.equal(board.mirror.pieces.KING.BLACK, 0x94);
  assert.equal(piecesSet(board.mirror.pieces), piecesSet(board.pieces));
});

test('preview', () => {
  const notation = FEN.STANDARD.split(' ')[0];
  const board = Board.parse(notation);
  const ply = board.ply(0x21, 0x91); // capture a horse
  const preview = board.preview(ply);
  const committed = preview.commit();
  const transit = board.transit(ply);
  assert.equal(preview.hash, transit.hash);
  assert.equal(preview.notation, transit.notation);
  assert.equal(committed.hash, transit.hash);
  assert.equal(committed.notation, transit.notation);
  assert.equal(piecesSet(preview.pieces), piecesSet(transit.pieces));

  assert.equal(preview.mirror.notation, transit.mirror.notation);
  assert.equal(piecesSet(preview.mirror.pieces), piecesSet(transit.mirror.pieces));
});

test.run();
