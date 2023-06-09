import { ROOM, colors } from '../../constant/index.js';
import Game from './game.js';

const { EVENT } = ROOM;

export default class SimpleBot {

  #handle;
  #unsubscribeHandle;
  #engine;
  #delay;
  #options;

  #game;
  #index;
  #position;
  #result;

  constructor(engine, { delay = 500, handle, ...options } = {}) {
    this.#engine = engine;
    this.#delay = delay;
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

  #onStart({ index, initialPosition, position, plies = [], result }) {
    this.#game = new Game({ initialPosition, position, plies, result });
    this.#index = index;
    this.#position = position;
    this.#result = result;
    this.#moveIfNecessary(index);
  }

  #onMove({ index, ply, result }) {
    this.#game = this.#game.transit(ply, result);
    const { from, to } = ply;
    this.#index = index + 1;
    this.#position = this.#position.transit(this.#position.ply(from, to));
    this.#result = result;
    this.#moveIfNecessary(index + 1);
  }

  #onUndo({ index, plies }) {
    this.#game = this.#game.undo(plies);
    this.#position = plies.reduce((position, ply) => position.undo(ply), this.#position);
    this.#index = index - plies.length;
    this.#result = undefined;
    this.#moveIfNecessary(index);
  }

  #moveIfNecessary(index) {
    const game = this.#game;
    if (game.position.color !== this.color || game.result) {
      return; // not my turn
    }
    const by = Date.now() + this.#delay;
    setTimeout(() => this.#makeNextMove(index, game, by));
  }

  async #makeNextMove(index, game, by) {
    const start = performance.now();
    const ply = await this.#engine.next(game);
    const cost = performance.now() - start;

    console.log(`[BOT] ${colors.en(this.#handle.color)}: ${ply} (${cost.toFixed(2)}ms)`);

    const delay = by - Date.now();
    if (delay > 0) {
      setTimeout(() => this.#handle.move(index, ply), delay);
    } else {
      this.#handle.move(index, ply);
    }
  }

}
