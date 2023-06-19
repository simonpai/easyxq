import { Position, Ply } from '../../model/index.js';

export default class Game {

  static load({
    initialPosition,
    position,
    plies,
    result,
  }) {
    initialPosition = initialPosition ? Position.load(initialPosition) : Position.standard();
    position = position ? Position.load(position) : initialPosition;
    plies = plies.map(Ply.decode);
    return new Game({ initialPosition, position, plies, result });
  }

  constructor({
    initialPosition,
    position,
    result,
    plies,
  }) {
    Object.assign(this, { initialPosition, position, plies, result });
    Object.freeze(this);
  }

  get index() {
    return this.plies.length;
  }

  transit(ply, result) {
    const { initialPosition, position, plies } = this;
    const { from, to } = ply;
    return new Game({
      initialPosition,
      position: position.transit(position.ply(from, to)),
      plies: [...plies, ply],
      result,
    });
  }

  undo(count) {
    let { initialPosition, position } = this;
    for (const ply of this.plies.slice(-count).reverse()) {
      position = position.undo(ply);
    }
    return new Game({
      initialPosition,
      position,
      plies: this.plies.slice(0, -count),
      result: undefined,
    });
  }

}
