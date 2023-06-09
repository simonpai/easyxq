import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { atob, btoa, arrayBufferToBase64, base64ToArrayBuffer } from '../lib/index.js';

// tests //
test('btoa', () => {
  const string = 'Hello, world!';
  assert.equal(atob(btoa(string)), string);
});

test('bytes', () => {
  const bytes = new Uint8Array([1, 2, 3, 4, 5]);
  const base64 = arrayBufferToBase64(bytes.buffer);
  const decoded = new Uint8Array(base64ToArrayBuffer(base64));
  assert.equal(decoded, bytes);
});

test.run();
