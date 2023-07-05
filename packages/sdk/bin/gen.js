import { bot, GameContext } from '../lib/index.js';

const p1 = bot.factory.buildEngine('tortoise');
const p2 = bot.factory.buildEngine('kitten');

const context = new GameContext({});

let game = bot.simple.Game.standard();

const start = Date.now();

while (!game.result) {
  const color = game.position.color;
  const player = color === 1 ? p1 : p2;
  const { from, to } = await player.next(game);
  const [position, ply, transitCalls, notation] = context.transit(game.position, from, to);
  console.log(`[Transit] ${notation}`);
  const { result } = context.queries(position);
  game = game.transit(ply, result);
}

const elapsed = Date.now() - start;

console.log(game.result);
console.log(`Elapsed: ${elapsed}ms`);
