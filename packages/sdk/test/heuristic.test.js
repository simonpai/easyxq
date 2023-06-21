import { test } from 'uvu';
import * as assert from 'uvu/assert';

import * as h from '../lib/bot/heuristic/index.js';
import { tool } from '../lib/index.js';

test('chase', () => {
  const position = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR r - - 0 1';
  const ply = 'b2c2';
  const heuristic = h.naive.chase().filter(h.isNaiveOpeningCannonChase().negate);
  const score = tool.h.evaluate(heuristic, { position, ply });
  assert.is(score, 0);
});

test('dodge', () => {
  const position = 'r1eaka2r/9/h1c1e1c1h/p1p5p/4p1p2/2P3P2/P3P3P/E5HCE/1C7/RH1AKA2R r';
  const ply = 'a0a1';
  const heuristic = h.naive.dodge();
  const score = tool.h.evaluate(heuristic, { position, ply, lastPlies: [] });
  assert.is(score, 0);
});

test('protect', () => {
  const position = 'rh1aka3/1R1c5/e7R/2pCp1p2/p7p/2P3P2/P3H4/2H1E4/9/2EAKA3 b';
  const ply = 'd8i8'; // 'c9e3'
  const heuristic = h.naive.protect();
  const score = tool.h.evaluate(heuristic, { position, ply, lastPlies: [] });
  assert.is(score, 0);
});

test('protect', () => {
  const position = 'r2akaehr/9/c1h1e4/p3p3p/2p3p2/P8/2P1P3P/4E1C1R/2C1A4/RH1c1K1H1 r';
  const ply = 'e1d0';
  const heuristic = h.naive.protect();
  const score = tool.h.evaluate(heuristic, { position, ply, lastPlies: [49561, 264831106] });
  assert.is(score, 900);
});

/*
test('protect', () => {
  const position = '2eaka3/9/2h1e1P2/9/C8/2p5P/2P1R4/1rH1E4/4Ar3/R1E1KA1h1 r';
  const ply = 'a5a2';
  const heuristic = h.naive.protect();
  const score = tool.h.evaluate(heuristic, { position, ply, lastPlies: [264787030, 265098503] });
  console.log(score);
});
*/

test('protect', () => {
  const position = 'rh1a2e1r/1R2a4/4k1hc1/p1H1p1p1p/2e6/4P1P2/P7P/4C2C1/4A4/2c1KAEHR b';
  const ply = 'c0c6';
  const heuristic = h.naive.protect();
  const score = tool.h.evaluate(heuristic, { position, ply, lastPlies: [265850948, 266413393] });
  assert.is(score, 0);
});

test.run();
