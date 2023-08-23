import { workerData, parentPort } from 'worker_threads';
import { bot, GameContext } from '../lib/index.js';

const { bots, n } = workerData;

async function runGame({ bots }) {
  const [p1, p2] = bots.map(config => bot.buildEngine(config));

  const context = new GameContext({});
  
  let game = bot.simple.Game.standard();
  
  const start = Date.now();
  
  while (!game.result) {
    const color = game.position.color;
    const player = color === 1 ? p1 : p2;
    const { from, to } = await player.next(game);
    const [position, ply, _, notation] = context.transit(game.position, from, to);
    //console.log(`[Transit] ${notation}`);
    const { result } = context.queries(position);
    game = game.transit(ply, result);
  }
  
  const elapsed = Date.now() - start;
  const { result } = game;

  return { elapsed, result };
}

let results = {
  elapsed: 0,
  wins: [0, 0],
};
for (let i = 0; i < n; i++) {
  const { elapsed, result } = await runGame({ bots });
  results.elapsed += elapsed;
  if (result.winner) {
    results.wins[result.winner - 1]++;
  }
  parentPort.postMessage({ i, elapsed, result });
  //console.log(`[${id}] #${i}`, result, `Elapsed: ${elapsed}ms`);
}

//console.log(results);
//parentPort.postMessage(results);
