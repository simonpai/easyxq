import { ROOM } from '../constant/index.js';

const { ACTION } = ROOM;

export const playerHandleMixin = {
  move(index, { from, to }) {
    this.send(ACTION.MOVE, { index, from, to });
  },
  requestTakeback(index) {
    this.send(ACTION.REQUEST_TAKEBACK, { index });
  },
};

export class PlayerHandle {

  #handle;

  constructor(color, handle) {
    this.#handle = handle;
    this.color = color;
    Object.freeze(this);
  }

  subscribe(callback) {
    return this.#handle.subscribe(callback);
  }

  send(name, data) {
    this.#handle.send(name, data);
  }

}

Object.assign(PlayerHandle.prototype, playerHandleMixin);

export class DualPlayerHandle {

  #handle;

  constructor(handle) {
    this.#handle = handle;
    Object.freeze(this);
  }

  subscribe(callback) {
    return this.#handle.subscribe(callback);
  }

  // actions //
  move(color, index, { from, to }) {
    this.#handle.send(color, ACTION.MOVE, { index, from, to });
  }

  requestTakeback(color, index) {
    this.#handle.send(color, ACTION.REQUEST_TAKEBACK, { index });
  }

}
