export function asString(value) {
  return value !== undefined && value !== null ? `${value}` : value;
}

export function trimObj(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] === undefined) {
      delete obj[k];
    }
  }
  return obj;
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

/*
export function delegateSetters(target, source, propNames) {
  propNames = typeof propNames === 'string' ? [propNames] : propNames;
  Object.defineProperties(target, propNames.reduce((acc, propName) => {
    acc[propName] = { set: (value) => { source[propName] = value; } };
    return acc;
  }, {}));
}
*/

/*
export function delegateProperties(target, source, propNames) {
  propNames = typeof propNames === 'string' ? [propNames] : propNames;
  Object.defineProperties(target, propNames.reduce((acc, propName) => {
    acc[propName] = {
      get: () => source[propName],
      set: (value) => { source[propName] = value; },
    };
    return acc;
  }, {}));
}
*/

export function defineValues(target, source) {
  for (const name in source) {
    if (source.hasOwnProperty(name)) {
      Object.defineProperty(target, name, { value: source[name] });
    }
  }
}

/*
export function bindSelf(target, propNames) {
  for (const name of propNames || target.getOwnPropertyNames()) {
    if (typeof target[name] === 'function') {
      target[name] = target[name].bind(target);
    }
  }
}
*/
