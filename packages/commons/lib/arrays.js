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

// Fisher–Yates
export function shuffle(array) {
  for (let i = array.length; i > 1;) {
    const j = Math.floor(Math.random() * i);
    i--;
    if (i !== j) {
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  return array;
}
