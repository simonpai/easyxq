export function mapped(iterable, fn) {
  return {
    *[Symbol.iterator]() {
      for (const item of iterable) {
        yield fn(item);
      }
    }
  };
}

export function filtered(iterable, fn) {
  return {
    *[Symbol.iterator]() {
      for (const item of iterable) {
        if (fn(item)) {
          yield item;
        }
      }
    }
  };
}
