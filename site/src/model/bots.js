import { bot as _bot, commons } from '@easyxq/sdk';
import _presets from './presets.yml';

const { randomItem } = commons;

const PRESET_MAP = _presets.reduce((map, { id, ...bot}) => {
  map[id] = bot;
  return map;
}, {});

export const presets = _presets;

export function get(preset) {
  return PRESET_MAP[preset];
}

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
    config = randomItem(Object.values(presets));
  }
  if (typeof config === 'string') {
    config = { preset: config };
  }
  return extend(PRESET_MAP[config.preset], config);
}

function buildProfile(config) {
  const { preset } = config;
  return {
    type: 'bot',
    ...PRESET_MAP[preset],
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
