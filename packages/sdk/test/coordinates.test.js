import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { coordinates as c } from '../lib/constant/index.js';

test('format', () => {
  for (let sid = 0; sid >= 0; sid = c.next(sid)) {
    assert.equal(c.parse(c.format(sid)), sid);
  }
});

test.run();
