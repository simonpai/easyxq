import { ROOM, colors } from '../constant/index.js';

const { EVENT } = ROOM;

export default class Aftermath {

  constructor({ game, players, events }) {
    const { plies, result } = game;
    const moves = Math.ceil(plies.length / 2);

    const takebackCounts = [0, 0];
    for (const event of events) {
      switch (event.name) {
        case EVENT.UNDO:
          takebackCounts[colors.index(event.requestedBy)]++;
          break;
      }
    }
    Object.assign(this, { players, result, moves, takebackCounts });
    Object.freeze(this);
  }

}
