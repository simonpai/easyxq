import { bot, GameContext } from '../lib/index.js';

const p1 = bot.buildEngine({
  abilities: {
    capture: 1,
    dodge: 1,
    protect: 1,
    //check: 1,
    //chase: 1,
    //win: 1,
  },
});
const p2 = bot.buildEngine({
  abilities: {
    capture: 1,
    dodge: 1,
    protect: 1,
    check: 1,
    chase: 1,
    win: 1,
  },
  quirks: {
    //capture: 0.5,
    //dodge: 2,
    //protect: 2,
    conscious: 1,
    //vengeful: 1,
  },
});

const context = new GameContext({});

let game = bot.simple.Game.standard();

const start = Date.now();

while (!game.result) {
  const color = game.position.color;
  const player = color === 1 ? p1 : p2;
  const { from, to } = await player.next(game);
  const [position, ply, _, notation] = context.transit(game.position, from, to);
  console.log(`[Transit] ${notation}`);
  const { result } = context.queries(position);
  game = game.transit(ply, result);
}

const elapsed = Date.now() - start;

console.log(game.result);
console.log(`Elapsed: ${elapsed}ms`);
