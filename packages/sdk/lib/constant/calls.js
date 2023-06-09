import { RESULT } from './call.js';

export function getResult(calls) {
  for (const call of calls) {
    if (call.type === RESULT) {
      const { [RESULT]: type, ...rest } = call;
      return { ...rest, type };
    }
  }
}
