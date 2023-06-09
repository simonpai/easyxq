export function kebabToCamel(str) {
  return str.replace(/-./g, x => x[1].toUpperCase());
}
