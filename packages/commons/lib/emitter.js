import { delegateGetters } from './objects.js';
import { removeItem } from './arrays.js';

const DEFAULT_ERROR_HANDLER = e => console.error(e);

export default class Emitter {

  #error;
  #namedCallbacks;
  #unnamedCallbacks;

  constructor({ error = DEFAULT_ERROR_HANDLER } = {}) {
    this.#error = error;
    this.#namedCallbacks = {};
    this.#unnamedCallbacks = [];
  }

  emit(name, data) {
    this.#checkName(name);
    if (name === '*') {
      throw new Error(`'*' is reserved for matching any event name in on() method.`);
    }
    const meta = Object.freeze({ name, ts: Date.now() });
    const event = { data, meta };
    const callbacks = this.#namedCallbacks[name];
    if (callbacks) {
      for (const callback of callbacks) {
        callback(event);
      }
    }
    for (const callback of this.#unnamedCallbacks) {
      callback(event);
    }
  }

  on(name, callback) {
    this.#checkName(name);
    this.#checkCallback(callback);
    return this.#on(name, this.#wrapCallback(callback));
  }

  once(name) {
    this.#checkName(name);
    const self = this;
    return new Promise((resolve, reject) => {
      const off = self.#on(name, (event) => {
        setTimeout(() => off());
        try {
          resolve(event);
        } catch(e) {
          reject(e);
        }
      });
    });
  }

  injectSubscribeInterface(target) {
    delegateGetters(target, this, ['on', 'once']);
  }

  // helper //
  #checkName(name) {
    if (typeof name !== 'string') {
      throw new Error(`Event name should be a string: ${name}`);
    }
  }

  #checkCallback(callback) {
    if (typeof callback !== 'function') {
      throw new Error(`Event callback should be a function: ${callback}`);
    }
  }

  #wrapCallback(callback) {
    const self = this;
    return ({ data, meta }) => {
      try {
        callback(data, meta);
      } catch(e) {
        self.#error(new Error(`Error in callback of event '${meta.name}': ${e.message}`, { cause: e }));
      }
    };
  }

  #on(name, wrappedCallback) {
    if (name === '*') {
      this.#unnamedCallbacks.push(wrappedCallback);
    } else {
      (this.#namedCallbacks[name] || (this.#namedCallbacks[name] = [])).push(wrappedCallback);
    }
    // return the corresponding unsubscribe function
    return () => this.#off(name, wrappedCallback);
  }

  #off(name, wrappedCallback) {
    if (name === '*') {
      removeItem(this.#unnamedCallbacks, wrappedCallback);
    } else {
      const callbacks = this.#namedCallbacks[name];
      callbacks && removeItem(callbacks, wrappedCallback);
    }
  }

}
