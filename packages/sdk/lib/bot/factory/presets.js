/*
 * conscious: lower oblivion penalty by 25%
 * vengeful: more likely to recapture
 * determined: weight more toward scores
 * impatient: quicker to make a move
 */

const BUTTERFLY = {
  preset: 'butterfly',
  abilities: {},
};

const BUNNY = {
  preset: 'bunny',
  abilities: {
    dodge: 1,
  },
  quirks: {
    valuing: 'naive',
  },
};

const CRAB = {
  preset: 'crab',
  abilities: {
    capture: 1,
  },
  quirks: {
    sidewalking: true,
    valuing: 'naive',
  },
}

const DUCKLING = {
  preset: 'duckling',
  abilities: {
    capture: 1,
    dodge: 1,
  },
  quirks: {
    valuing: 'naive',
  },
};

const CHIHUAHUA = {
  preset: 'chihuahua',
  abilities: {
    capture: 1,
    check: 1,
    chase: 1,
  },
  quirks: {
    check: 2,
    chase: 2,
  },
};

const TORTOISE = {
  preset: 'tortoise',
  abilities: {
    capture: 1,
    dodge: 1,
    protect: 1,
  },
  quirks: {
    capture: 0.5,
    dodge: 2,
    protect: 2,
    conscious: 1,
    vengeful: 1,
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
  quirks: {
    conscious: -2,
  },
};

export default [
  BUTTERFLY,
  BUNNY,
  CRAB,
  DUCKLING,
  CHIHUAHUA,
  TORTOISE,
  KITTEN,
];
