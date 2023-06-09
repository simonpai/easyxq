import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { COLOR } from '../lib/constant/index.js';
import { findChecks } from '../lib/helpers/index.js';
import { Board } from '../lib/model/index.js';

// tests //
test('finds checks', () => {
  const board = Board.parse('rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1C1P1P/7C1/9/RNBAKABNR');
  const checks = new Set([...findChecks({ board, color: COLOR.BLACK })].map(ply => `${ply}`));
  assert.equal(checks, new Set(['C/e3e9/k']));

  const ply = board.ply(0x95, 0x85);
  const preview = board.preview(ply);
  const checks2 = new Set([...findChecks({ board: preview, color: COLOR.BLACK })].map(ply => `${ply}`));
  assert.equal(checks2, new Set(['C/e3e9/k']));
});

test('find checks v2', () => {
  const board = Board.parse('rheakaehr/9/4c2c1/p1p3p1p/4p4/9/P1P3P1P/1C5C1/4K4/RHEA1AEHR');
  const checks = new Set([...findChecks({ board, color: COLOR.RED })].map(ply => `${ply}`));
  assert.equal(checks, new Set(['c/e7e1/K']));
});

test.run();
