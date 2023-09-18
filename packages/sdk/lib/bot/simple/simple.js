import { ROOM, colors } from '../../constant/index.js';
import { Ply } from '../../model/index.js';
import Game from './game.js';

const { EVENT } = ROOM;

export default class SimpleBot {

  #handle;
  #unsubscribeHandle;
  #engine;
  #delay;
  #debug;
  #options;

  #game;
  #index;
  #seed;

  constructor(engine, { delay = 500, handle, debug, ...options } = {}) {
    this.#engine = engine;
    this.#delay = delay;
    this.#debug = debug;
    this.#options = options;

    this.handle = handle;
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
    }
  }

  get color() {
    return this.#handle.color;
  }

  get profile() {
    return {
      color: this.#handle.color,
    };
  }

  get options() {
    return this.#options;
  }

  #onEvent(name, event) {
    switch (name) {
      case EVENT.START:
      case EVENT.RESUME:
        this.#onStart(event);
        break;
      case EVENT.MOVE:
        this.#onMove(event);
        break;
      case EVENT.UNDO:
        this.#onUndo(event);
        break;
    }
  }

  #onStart({ index, seed, game }) {
    this.#game = Game.load(game);
    this.#index = index;
    this.#seed = seed;
    this.#moveIfNecessary();
  }

  #onMove({ index, seed, ply, result }) {
    ply = Ply.decode(ply);
    this.#game = this.#game.transit(ply, result);
    this.#index = index + 1;
    this.#seed = seed;
    this.#moveIfNecessary();
  }

  #onUndo({ index, seed, count }) {
    this.#game = this.#game.undo(count);
    this.#index = index - count;
    this.#seed = seed;
    this.#moveIfNecessary();
  }

  #moveIfNecessary() {
    const index = this.#index;
    const game = this.#game;
    const seed = this.#seed;
    if (game.position.color !== this.color || game.result) {
      return; // not my turn
    }
    const by = Date.now() + this.#delay;
    setTimeout(() => this.#makeNextMove(index, game, by, seed));
  }

  async #makeNextMove(index, game, by, seed) {
    const start = performance.now();
    const ply = await this.#engine.next(game, seed);
    const cost = performance.now() - start;

    this.#debug && this.#debug(`[BOT] ${colors.en(this.#handle.color)}: ${ply} (${cost.toFixed(2)}ms)`);

    const delay = by - Date.now();
    if (delay > 0) {
      setTimeout(() => this.#handle.move(index, ply), delay);
    } else {
      this.#handle.move(index, ply);
    }
  }

}
