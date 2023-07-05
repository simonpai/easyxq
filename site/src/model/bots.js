import { bot as _bot } from '@easyxq/sdk';
import _bots from './bots.yml';

const BOT_MAP = _bots.reduce((map, { preset, ...bot}) => {
  map[preset] = bot;
  return map;
}, {});

export const BOTS = _bots;

export function get(preset) {
  return BOT_MAP[preset];
}

export function build(config) {
  config = _bot.factory.normalize(config);
  const profile = buildProfile(config);

  // must be written this way for webpack to work
  const worker = new Worker(new URL('../worker/bot.js', import.meta.url));
  const bot = new _bot.worker.WorkerBot(worker, { config });

  return { profile, bot };
}

function buildProfile(config) {
  const { preset } = config;
  return {
    type: 'bot',
    ...BOT_MAP[preset],
    ...config,
  };
}
