const BUTTERFLY = {
  preset: 'butterfly',
  abilities: {},
};

const BUNNY = {
  preset: 'bunny',
  abilities: {
    dodge: 1,
  },
};

const CRAB = {
  preset: 'crab',
  abilities: {
    capture: 1,
  },
  quirks: {
    sidewalk: true,
  },
}

const DUCKLING = {
  preset: 'duckling',
  abilities: {
    capture: 1,
    dodge: 1,
  },
};

const CHIHUAHUA = {
  preset: 'chihuahua',
  preferences: {
    capture: 0.5,
    check: 2,
    chase: 2,
  },
  abilities: {
    capture: 1,
    check: 1,
    chase: 1,
  },
};

const KITTEN = {
  preset: 'kitten',
  abilities: {
    capture: 1,
    dodge: 1,
    protect: 1,
    check: 1,
    chase: 1,
    win: 1,
  },
  knowledge: {
    valuing: 1,
  },
};

export default [
  BUTTERFLY,
  BUNNY,
  CRAB,
  DUCKLING,
  CHIHUAHUA,
  KITTEN,
];
