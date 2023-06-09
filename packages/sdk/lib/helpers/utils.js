export function randomInt() {
  return Math.random() * 2 ** 32 | 0;
}

export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Find the index i such that arr[i - 1] <= value < arr[i].
 */
export function searchIndex(array, value) {
  let left = 0;
  let right = array.length - 1;
  while (left < right) {
    const mid = (left + right) >> 1;
    if (value < array[mid]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

export function any(iterator) {
  for (const item of iterator) {
    return item;
  }
  return undefined;
}
