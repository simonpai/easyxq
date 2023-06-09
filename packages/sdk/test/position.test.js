import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { FEN } from '../lib/constant/index.js';
import { Position } from '../lib/model/index.js';

// tests //
test('standard', () => {
  const fen = FEN.STANDARD;
  assert.equal(Position.standard().fen, fen);
});

test('snapshot', () => {
  const position = Position.standard();
  const snapshot = position.snapshot;
  const loaded = Position.load(snapshot);
  assert.equal(JSON.stringify(loaded.snapshot), JSON.stringify(snapshot));
});

test.run();
