export default class RoomInfo {

  #room;

  constructor(room) {
    this.#room = room;
  }

  get state() {
    return this.#room.state;
  }

  get context() {
    return this.#room.context;
  }

  get players() {
    return this.#room.players;
  }

  player(color) {
    return this.#room.player(color);
  }

}
