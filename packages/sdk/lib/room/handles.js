import { ROOM } from '../constant/index.js';

const { ACTION } = ROOM;

export class PlayerHandle {

  #handle;

  constructor(color, handle) {
    this.#handle = handle;
    this.color = color;
    Object.freeze(this);
  }

  // events //
  subscribe(...args) {
    return this.#handle.subscribe(...args);
  }

  // actions //
  move(index, { from, to }) {
    this.#handle.send(ACTION.MOVE, { index, from, to });
  }

  requestTakeback(index) {
    this.#handle.send(ACTION.REQUEST_TAKEBACK, { index });
  }

}

export class DualPlayerHandle {

  #handle;

  constructor(handle) {
    this.#handle = handle;
    Object.freeze(this);
  }

  // events //
  subscribe(...args) {
    return this.#handle.subscribe(...args);
  }

  // actions //
  move(color, index, { from, to }) {
    this.#handle.send(color, ACTION.MOVE, { index, from, to });
  }

  requestTakeback(color, index) {
    this.#handle.send(color, ACTION.REQUEST_TAKEBACK, { index });
  }

}
