import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { cpus } from 'os';
import { Worker } from 'worker_threads';

const CPU_COUNT = cpus().length;
const __dirname = dirname(fileURLToPath(import.meta.url));
const __worker = resolve(__dirname, 'gen.worker.js');

const bots = [
  {
    abilities: {
      capture: 1,
      dodge: 1,
      //protect: 1,
      //check: 1,
      //chase: 1,
      //win: 1,
    },
  },
  {
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
  },
];

const n = 100;
const m = Math.floor(n / CPU_COUNT);
const r = n % CPU_COUNT;

let results = {
  wins: [0, 0],
};

async function runWorker(i, workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__worker, { workerData });
    worker.on('message', ({ i: j, elapsed, result }) => {
      const k = j * CPU_COUNT + i;
      if (result.winner) {
        results.wins[result.winner - 1]++;
      }
      console.log(`#${k}`, result, `Elapsed: ${elapsed}ms`);
    });
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

const start = Date.now();

const promises = [];
for (let i = 0; i < CPU_COUNT; i++) {
  promises.push(runWorker(i, {
    bots,
    n: m + (i < r ? 1 : 0),
  }));
}
await Promise.all(promises);

console.log({
  elapsed: Date.now() - start,
  ...results,
});
