export function randomInt() {
  return Math.random() * 2 ** 32 | 0;
}

export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
