export default class RoomState {

  #room;

  constructor(room) {
    this.#room = room;
  }

  get players() {
    return this.#room.players;
  }

  get game() {
    return this.#room.game;
  }

  get index() {
    return this.game.index;
  }

  get context() {
    return this.#room.context;
  }

  get queries() {
    return this.#room.queries;
  }

  get events() {
    return this.#room.events;
  }

  get result() {
    return this.game.result;
  }

  get aftermath() {
    return this.#room.aftermath;
  }

}
