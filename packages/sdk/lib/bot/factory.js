import { trimObj } from '@easyxq/commons';
import * as simple from './simple/index.js';
import * as h from './heuristic/index.js';

export function build(config, options = {}) {
  return new simple.Bot(buildEngine(config, options.engine), options);
}

export function buildEngine(config, options) {
  const { abilities: { win, ...abilities } = {}, rules } = config;
  // TODO: ad-hoc
  // move win() to the front
  let abilityKeys = Object.keys(abilities);
  if (win > 0) {
    abilityKeys = ['win', ...abilityKeys];
  }

  if (abilityKeys.length === 0) {
    return new simple.RandomEngine();
  }
  const preferences = extractAbilityPreferences(config);
  const abilityOptions = extractAbilityOptions(config);
  let heuristic = h.sum(...abilityKeys.map(key => buildHeuristicAxis(key, abilityOptions, preferences[key])));
  heuristic = postProcessHeuristics(heuristic, config);

  return new simple.HeuristicRandomEngine({
    config,
    heuristic,
  }, options);
}

function resolveAbility(key, options) {
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

function extractAbilityPreferences({ quirks = {} } = {}) {
  const { capture, dodge, protect, check, chase, win } = quirks;
  return trimObj({ capture, dodge, protect, check, chase, win });
}

function extractAbilityOptions({ quirks = {} } = {}) {
  const { valuing, conscious = 0 } = quirks;
  return trimObj({ valuing, conscious });
}

function scaleByPreference(heuristic, preference = 1) {
  return preference === 1 ? heuristic : preference === 0 ? h.zero() : heuristic.scale(preference);
}

function buildHeuristicAxis(key, options, preference) {
  return scaleByPreference(resolveAbility(key, options), preference);
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
