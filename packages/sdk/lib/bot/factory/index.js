
import * as simple from '../simple/index.js';
import * as h from '../heuristic/index.js';
import { normalize } from './configurations.js';

export * from './configurations.js';
export { default as presets } from './presets.js';

export function build(config) {
  const { abilities: { win, ...abilities } = {}, preferences = {}, rules } = config = normalize(config);
  // TODO: ad-hoc
  // move win() to the front
  let abilityKeys = Object.keys(abilities);
  if (win > 0) {
    abilityKeys = ['win', ...abilityKeys];
  }

  if (abilityKeys.length === 0) {
    return new simple.Bot(new simple.RandomEngine());
  }
  const valuing = resolveValuing(config);
  let heuristic = h.sum(...abilityKeys.map(key => buildHeuristicAxis(key, valuing, preferences[key])));
  heuristic = postProcessHeuristics(heuristic, config);

  return new simple.Bot(new simple.HeuristicRandomEngine({
    config,
    heuristic,
  }));
}

function resolveAbility(key, valuing) {
  const options = { valuing };
  switch (key) {
    case 'capture':
      return h.naive.capture(options);
    case 'dodge':
      return h.naive.dodge(options);
    case 'protect':
      return h.naive.protect(options);
    case 'check':
      return h.naive.check();
    case 'chase':
      return h.naive.chase(options);
    case 'win':
      return h.win();
    default:
      throw new Error(`Unrecognized ability config: ${key}.`);
  }
}

function resolveValuing({ knowledge = {} } = {}) {
  const { valuing = 0 } = knowledge;
  return valuing === 0 ? 'naive' : 'standard';
}

function resolvePreference(heuristic, preference = 1) {
  return preference === 1 ? heuristic : preference === 0 ? h.zero() : heuristic.scale(preference);
}

function buildHeuristicAxis(key, valuing, preference) {
  return resolvePreference(resolveAbility(key, valuing), preference);
}

function postProcessHeuristics(heuristic, { abilities }) {
  // soft bans
  const bans = [];
  if (abilities.chase > 0) {
    bans.push({
      predicate: h.isNaiveOpeningCannonChase(),
      maxScore: 0,
    });
  }
  // search for naive.capture unprotected by dodge
  if (abilities.dodge === undefined && abilities.capture > 0) {
    bans.push({
      predicate: h.isNaiveOpeningCannonAttack(),
      maxScore: -100,
    });
  }
  if (bans.length > 0) {
    heuristic = heuristic.softbans(bans);
  }
  return heuristic;
}
