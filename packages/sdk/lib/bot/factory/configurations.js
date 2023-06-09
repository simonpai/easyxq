import { randomItem } from '../../helpers/index.js';
import presets from './presets.js';
import { extend } from './utils.js';

const PRESET_MAP = presets.reduce((map, preset) => {
  map[preset.preset] = preset;
  return map;
}, {});

export function classify(config) {
  // TODO
}

export function normalize(config) {
  if (config === 'random') {
    config = randomItem(Object.values(presets));
  }
  if (typeof config === 'string') {
    config = { preset: config };
  }
  return extend(PRESET_MAP[config.preset], config);
}
