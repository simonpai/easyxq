// TODO: move to commons package
export function any(iterator) {
  for (const item of iterator) {
    return item;
  }
  return undefined;
}
