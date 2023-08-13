import { build } from '../factory.js';
import { playerHandleMixin } from '../../room/handles.js';

export default async function initialize(scope) {
  const { color, config } = await waitForConfig(scope);
  const handle = new WorkerHandle(color, scope);
  const debug = (...args) => console.log(...args);
  const bot = build(config, {
    debug,
    engine: { debug },
  });
  bot.handle = handle;
  return bot;
}

async function waitForConfig(scope) {
  return new Promise((resolve) => {
    // TODO: shall we queue up other messages?
    const listener = ({ data = {} }) => {
      if (data.color === undefined || data.config === undefined) {
        return;
      }
      scope.removeEventListener('message', listener);
      resolve(data);
    };
    scope.addEventListener('message', listener);
  });
}

class WorkerHandle {

  #scope;

  constructor(color, scope) {
    this.#scope = scope;
    this.color = color;
    Object.freeze(this);
  }
  
  subscribe(callback) {
    const listener = ({ data: { name, event } }) => callback(name, event);
    this.#scope.addEventListener('message', listener);
    return () => this.#scope.removeEventListener('message', listener);
  }

  send(name, data) {
    this.#scope.postMessage({ name, data });
  }

}

Object.assign(WorkerHandle.prototype, playerHandleMixin);
