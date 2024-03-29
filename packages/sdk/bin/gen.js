import { bot, GameContext } from '../lib/index.js';

function buildEngines() {
  return [
    bot.buildEngine({
      abilities: {
        capture: 1,
        dodge: 1,
        //protect: 1,
        //check: 1,
        //chase: 1,
        //win: 1,
      },
    }),
    bot.buildEngine({
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
        conscious: -2,
        //vengeful: 1,
      },
    })
  ];
}

async function runGame() {
  const [p1, p2] = buildEngines();

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
for (let i = 0; i < 100; i++) {
  const { elapsed, result } = await runGame();
  results.elapsed += elapsed;
  if (result.winner) {
    results.wins[result.winner - 1]++;
  }
  console.log(`#${i}`, result, `Elapsed: ${elapsed}ms`);
}

console.log(results);
