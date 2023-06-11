import { CALL } from '../../../constant/index.js';
import { variable as v } from './utils.js';

export * from './constants.js';
export * as naive from './naive.js';

export function win() {
  return WIN;
}

const WIN = v('win', ({ context, after, me }) => {
  const result = context.queries(after).result;
  return result && result.type === CALL.DECISIVE && result.winner === me ? Infinity : 0;
});
