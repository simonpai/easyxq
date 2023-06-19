import { mixin, defineValues } from '@easyxq/commons';
import { pids, colors, COLOR, FEN, coordinates as c } from '../constant/index.js';
import { hashPosition } from '../helpers/index.js';
import Board from './board/board.js';

export default class Position {

  static #standard;

  static standard() {
    return Position.#standard || (Position.#standard = Position.parse(FEN.STANDARD));
  }

  static parse(fen) {
    const [ board, color = 'r', _0, _1, clock = '0', moveNum = '1' ] = fen.split(/\s+/g);
    return new Position({
      board: Board.parse(board),
      color: colors.parse(color),
      clock: Number(clock),
      moveNum: Number(moveNum), // TODO: guard against NaN
    });
  }

  static load({ board, color, clock, moveNum }) {
    return new Position({ board: Board.load(board), color, clock, moveNum });
  }

  _hash;
  _fen;
  _snpashot;

  constructor({ board, color, clock = 0, moveNum = 1 }) {
    defineValues(this, { board, color, clock, moveNum });
  }

  transit(ply) {
    if (!ply.piece) {
      ply = this.ply(ply.from, ply.to);
    }
    const color = colors.mirror(this.color);
    return new Position({
      board: this.board.transit(ply),
      color,
      clock: pids.isPiece(ply.captured) ? 0 : this.clock + 1,
      moveNum: this.color === COLOR.BLACK ? this.moveNum + 1 : this.moveNum,
    });
  }

  undo(ply, { clock = 0 } = {}) {
    const color = colors.mirror(this.color);
    return new Position({
      board: this.board.undo(ply),
      color,
      clock: pids.isPiece(ply.captured) ? clock : this.clock - 1,
      moveNum: color === COLOR.BLACK ? this.moveNum - 1 : this.moveNum,
    });
  }

}

// preview //
class PreviewPosition {

  #parent;
  #ply;
  #board;
  #materialized;

  constructor(parent, ply) {
    this.#parent = parent;
    this.#ply = ply;
    defineValues(this, {
      previewing: true,
    });
  }

  get board() {
    return this.#board || (this.#board = this.#parent.board.preview(this.#ply));
  }

  get color() {
    return colors.mirror(this.#parent.color);
  }

  get clock() {
    return pids.isEmpty(this.#ply.captured) ? 0 : this.#parent.clock + 1;
  }

  get moveNum() {
    return this.#parent.color === COLOR.BLACK ? this.#parent.moveNum + 1 : this.#parent.moveNum;
  }

  commit() {
    return this.#materialized || (this.#materialized = this.#parent.transit(this.#ply));
  }

}

// mixin //
const props = {
  ply: {
    value(from, to) {
      return this.board.ply(from, to);
    }
  },
  preview: {
    value(ply) {
      return new PreviewPosition(this, ply);
    }
  },
  hash: {
    get() {
      return this._hash || (this._hash = hashPosition(this));
    }
  },
  fen: {
    get() {
      return this._fen || (this._fen = `${this.board.notation} ${colors.format(this.color)} - - ${this.clock} ${this.moveNum}`);
    }
  },
  snapshot: {
    get() {
      return this._snpashot || (this._snpashot = Object.freeze({
        board: this.board.snapshot,
        color: this.color,
        clock: this.clock,
        moveNum: this.moveNum,
      }));
    }
  },
};

for (const PositionClass of [Position, PreviewPosition]) {
  mixin(PositionClass, props);
}
