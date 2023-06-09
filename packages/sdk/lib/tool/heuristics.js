import { coordinates as c } from '../constant/index.js';
import { Position, Ply } from '../model/index.js';
import { GameContext } from '../room/index.js';
import { Input } from '../bot/simple/index.js';

export function evaluate(heuristic, { position, ply, lastPlies = [] }, { rules } = {}) {
  if (typeof position === 'string') {
    position = Position.parse(position);
  }
  const { from, to } = parsePly(ply);
  ply = position.ply(from, to);
  lastPlies = lastPlies.map(parsePly);

  const score = heuristic.evaluate(new Input({
    context: new GameContext({ rules }),
    before: position,
    ply,
    lastPlies,
  }));
  return Math.round(score);
}

function parseSids(str) {
  return {
    from: c.parse(str.substring(0, 2)),
    to: c.parse(str.substring(2, 4)),
  };
}

function parsePly(value) {
  switch (typeof value) {
    case 'string':
      return parseSids(value);
    case 'number':
      return Ply.decode(value);
    case 'object':
      return value;
    default:
      throw new Error(`Invalid ply format: ${value}`);
  }
}
