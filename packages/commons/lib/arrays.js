export function removeItem(array, item) {
  const i = array.indexOf(item);
  if (i > -1) {
    array.splice(i, 1);
  }
}

export function asArray(value) {
  return Array.isArray(value) ? value : (value === undefined) ? [] : [value];
}

export function immutableSet(iterable) {
  return Object.freeze(new Set(iterable));
}

export function sortBy(array, fn) {
  array.sort((a, b) => fn(a) - fn(b));
  return array;
}
