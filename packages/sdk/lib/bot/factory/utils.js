export function extend(base = {}, { abilities, preferences, knowledge, quirks, ...props } = {}) {
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
