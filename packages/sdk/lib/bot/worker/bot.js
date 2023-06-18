export default class WorkerBot {

  #worker;
  #handle;
  #config;
  #configSent = false;
  #unsubscribeHandle;

  constructor(worker, { config, handle } = {}) {
    this.#worker = worker;
    this.config = config;
    this.handle = handle;
    worker.onmessage = ({ data: { name, data } }) => this.#handle.send(name, data);
  }

  set config(config) {
    this.#config = config;
    this.#sendConfigIfAvailable();
  }

  set handle(handle) {
    if (this.#handle === handle) {
      return;
    }
    if (this.#handle) {
      this.#unsubscribeHandle();
      this.#handle = undefined;
    }
    if (handle) {
      this.#handle = handle;
      this.#unsubscribeHandle = handle.subscribe((...args) => this.#onEvent(...args));
      this.#sendConfigIfAvailable();
    }
  }

  #sendConfigIfAvailable() {
    if (this.#configSent || this.#config === undefined || this.#handle === undefined) {
      return;
    }
    this.#configSent = true;
    this.#worker.postMessage({ color: this.#handle.color, config: this.#config });
  }

  #onEvent(name, event) {
    this.#worker.postMessage({ name, event });
  }

  destroy() {
    this.#worker.terminate();
  }

}
