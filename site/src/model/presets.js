import PRESET_DATA from './presets.yml';

const PRESETS = PRESET_DATA.map(({ avatar, ...props }) => ({
  avatar: `${PATH_PREFIX}img/avatar/${avatar}`,
  ...props,
}));

const PRESET_IDS = Object.freeze(PRESETS.map(({ id }) => id));

const PRESET_MAP = PRESETS.reduce((map, { id, ...bot}) => {
  map[id] = bot;
  return map;
}, {});

export default Object.freeze({
  *[Symbol.iterator]() {
    yield* PRESETS;
  },
  get(id) {
    return PRESET_MAP[id];
  },
  get ids() {
    return PRESET_IDS;
  },
});
