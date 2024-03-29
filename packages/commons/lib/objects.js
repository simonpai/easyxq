export function asString(value) {
  return value !== undefined && value !== null ? `${value}` : value;
}

export function trimObj(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  const trimmed = {};
  for (const k in obj) {
    // TODO: skip hasOwnProperty check
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) {
      trimmed[k] = obj[k];
    }
  }
  return trimmed;
}

export function mapValues(obj, fn) {
  const result = {};
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      result[k] = fn(obj[k], k);
    }
  }
  return result;
}

export function delegateGetters(target, source, propNames) {
  propNames = typeof propNames === 'string' ? [propNames] : propNames;
  Object.defineProperties(target, propNames.reduce((acc, propName) => {
    acc[propName] = typeof source[propName] === 'function' ? { value: source[propName].bind(source) } : { get: () => source[propName] };
    return acc;
  }, {}));
}

export function defineValues(target, source) {
  for (const name in source) {
    if (source.hasOwnProperty(name)) {
      Object.defineProperty(target, name, { value: source[name] });
    }
  }
}

export function mixin(target, props) {
  if (typeof target === 'function') {
    target = target.prototype;
  }
  for (const [key, value] of Object.entries(props)) {
    if (!Object.hasOwnProperty.call(target, key)) {
      Object.defineProperty(target, key, value);
    }
  }
}
