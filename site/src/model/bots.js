import { bot as _bot, utils } from '@easyxq/sdk';
import presets from './presets.js';

export function build(config) {
  config = normalize(config);
  const profile = buildProfile(config);

  // must be written this way for webpack to work
  const worker = new Worker(new URL('../worker/bot.js', import.meta.url));
  const bot = new _bot.worker.WorkerBot(worker, { config });

  return { profile, bot };
}

function normalize(config) {
  if (config === 'random') {
    config = utils.randomItem([...presets]);
  }
  if (typeof config === 'string') {
    config = { preset: config };
  }
  return extend(presets.get(config.preset), config);
}

function buildProfile(config) {
  const { preset } = config;
  return {
    type: 'bot',
    ...presets.get(preset),
    ...config,
  };
}

function extend(base = {}, { abilities, preferences, knowledge, quirks, ...props } = {}) {
  abilities = { ...base.abilities, ...abilities };
  preferences = { ...base.preferences, ...preferences };
  knowledge = { ...base.knowledge, ...knowledge };
  quirks = { ...base.quirks, ...quirks };
  return {
    ...base,
    abilities,
    preferences,
    knowledge,
    quirks,
    ...props,
  };
}
