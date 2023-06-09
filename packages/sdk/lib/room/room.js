import { removeItem, defineValues } from '@easyxq/commons';
import { ROOM, COLOR, colors, calls as _calls } from '../constant/index.js';
import { Game } from '../model/index.js';
import GameContext from './game-context.js';
import Player from './player.js';
import RoomState from './state.js';
import { PlayerHandle, DualPlayerHandle } from './handles.js';
import { StartEvent, MoveEvent, UndoEvent, EndEvent } from './events.js';

const { ACTION, EVENT } = ROOM;

// https://www.npmjs.com/package/rollup-plugin-web-worker-loader
// https://nodejs.org/api/worker_threads.html

function normalizePlayerCallback(callback, onError = error => console.error(error)) {
  switch (typeof callback) {
    case 'function':
      return async (name, data) => {
        try {
          await callback(name, data);
        } catch (e) {
          onError(e);
        }
      };
    case 'object':
      return async (name, data) => {
        if (typeof callback[name] !== 'function') {
          return;
        }
        try {
          await callback[name](data);
        } catch (e) {
          onError(e);
        }
      };
    default:
      throw new Error('callback should be either a function of a hash of functions');
  }
}

export default class Room {

  // settings
  #context;
  #rawPlayers;

  // states
  #state;
  #game;
  #calls; // TODO
  #cursor;
  #snapshot;

  #callbacks;
  //#stage;

  // TODO: #state = room state: game, events
  // TODO: #events

  // TODO: time

  static load({ rules, players, game }) {
    return new Room({ rules, players, game: Game.load(game) });
  }

  constructor({
    rules,
    players = [{}, {}],
    game,
    //onError,
  } = {}) {
    // validation
    // TODO: rules
    if (!players || !Array.isArray(players) || players.length !== 2) {
      throw new Error(`players array should contain exactly 2 entries: ${players}.`);
    }
    // rules -> context
    this.#context = new GameContext({ rules });

    // players
    this.#rawPlayers = players;
    players = Object.freeze([
      new Player(COLOR.RED, players[0]),
      new Player(COLOR.BLACK, players[1]),
    ]);

    // rules
    defineValues(this, {
      rules,
      players,
    });

    // game
    this.#setGame(this.#reconstructGame(game));

    this.#state = new RoomState(this);

    this.#callbacks = [];
    //this.#stage = STAGE.WAITING;
  }
  
  // getter //
  get context() {
    return this.#context;
  }

  player(color) {
    return this.players[colors.index(color)];
  }

  get game() {
    return this.#game;
  }

  get queries() {
    return this.#context.queries(this.#game.position);
  }

  get state() {
    return this.#state;
  }

  get snapshot() {
    return this.#snapshot || (this.#snapshot = this.#buildSnapshot());
  }

  #buildSnapshot() {
    return Object.freeze({
      rules: this.rules,
      players: this.#rawPlayers,
      game: this.game.snapshot,
    });
  }

  // user //
  handle(color) {
    return new PlayerHandle(color, {
      send: (name, data) => this.#onPlayerAction(color, name, data),
      subscribe: (...args) => this.subscribe(...args),
    });
  }

  get dualHandle() {
    return new DualPlayerHandle({
      send: (...args) => this.#onPlayerAction(...args),
      subscribe: (...args) => this.subscribe(...args),
    });
  }

  subscribe(callback) {
    // TODO: options.format to select event format: default raw
    callback = normalizePlayerCallback(callback, e => this.#error(e));
    this.#callbacks.push(callback);
    return () => removeItem(this.#callbacks, callback);
  }

  #emit(name, event) {
    //console.log(`[Room Event] ${name}`, event);
    for (const callback of this.#callbacks) {
      callback(name, event);
    }
  }

  // action handler //
  async #onPlayerAction(color, name, data) {
    const player = this.player(color);
    switch (name) {
      /*
      case ACTION.READY:
        await this.#onReady(player, data);
        break;
      */
      case ACTION.MOVE:
        this.#onMove(player, data);
        break;
      case ACTION.REQUEST_TAKEBACK:
        this.#onRequestTakeback(player, data);
        break;
      /*
      case ACTION.QUIT:
        await this.#onQuit(player, data);
        break;
      */
    }
  }

  /*
  async #onReady(player, data) {
    player.ready = true;
  }
  */

  #onMove(player, { index, from, to }) {
    // TODO: still need to check players
    //this.#assertStage(STAGE.PLAYING);

    if (this.#game.index !== index) {
      // this may happen due to race condition of bot move and human undo
      return; // not for current state, ignore
    }
    if (this.#game.position.color !== player.color) {
      throw new Error(`It's not your turn: ${player.color}`);
    }

    const [position, ply, transitCalls] = this.#context.transit(this.#game.position, from, to);
    let { result, calls } = this.#context.queries(position);
    this.#setGame(this.#game.transit(ply, result), transitCalls);

    this.#emit(EVENT.MOVE, new MoveEvent({ index, ply, calls, result }));
    result && this.#emit(EVENT.END, new EndEvent({ index: this.#game.index, result }));
  }

  #onRequestTakeback(player, { index }) {
    if (this.#game.index !== index) {
      return;
    }
    const { lastPly } = this.#game;
    const takebackPlyCount = lastPly.color === player.color ? 1 : 2;
    if (takebackPlyCount > index) {
      throw new Error(`Cannot takeback ${takebackPlyCount} plies at index ${index}`);
    }

    const plies = this.#game.plies.slice(-takebackPlyCount);
    plies.reverse();
    let game = this.#game;
    for (let i = 0; i < takebackPlyCount; i++) {
      game = game.undo();
    }
    this.#setGame(game); // TODO: lost transit calls here

    this.#emit(EVENT.UNDO, new UndoEvent({ index, plies }));
  }

  // lifecycle //
  start() {
    // TODO: stage
    const { initialPosition, position, plies, result, index } = this.#game;
    this.#emit(EVENT.START, new StartEvent({ index, initialPosition, position, plies, result }));
  }

  #error(error) {
    console.error(error);
  }

  // helper //
  #setGame(game, calls = []) {
    this.#game = game;
    this.#snapshot = undefined;
    this.#calls = [...calls, ...this.queries.calls];
  }

  #reconstructGame(game) {
    if (!game) {
      return new Game();
    }
    const position = game.position || game.initialPosition;
    const result = position ? this.#context.queries(position).result: undefined;
    // TODO: get player info
    return new Game({
      ...game,
      result,
    });
  }
  /*
  #assertStage(stage) {
    if (this.#stage !== stage) {
      throw new Error(`Required stage: ${stage}. Current stage: ${this.#stage}.`);
    }
  }
  */

}
