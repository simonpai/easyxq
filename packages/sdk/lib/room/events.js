import { ROOM, pids } from '../constant/index.js';

export class StartEvent {

  constructor({ index, initialPosition, position, plies = [], result }) {
    this.type = ROOM.EVENT.START;
    this.index = index;
    this.initialPosition = initialPosition;
    this.position = position;
    this.plies = plies;
    if (result) {
      this.result = result;
    }
    Object.freeze(this);
  }

}

export class MoveEvent {

  constructor({ index, ply, calls = [], result }) {
    this.type = ROOM.EVENT.MOVE;
    this.color = pids.color(ply.pid);
    this.index = index;
    this.ply = ply;
    this.calls = calls;
    if (result) {
      this.result = result;
    }
    Object.freeze(this);
  }

}

export class EndEvent {

  constructor({ index, result }) {
    this.type = ROOM.EVENT.END;
    this.index = index;
    this.result = result;
    Object.freeze(this);
  }

}

export class UndoEvent {

  constructor({ index, plies }) {
    this.type = ROOM.EVENT.UNDO;
    this.index = index;
    this.plies = plies;
    Object.freeze(this);
  }

}
