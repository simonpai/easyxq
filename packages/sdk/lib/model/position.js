import { defineValues } from '@easyxq/commons';
import { pids, colors, COLOR, FEN, coordinates as c } from '../constant/index.js';
import { hashPosition } from '../helpers/index.js';
import Board from './board/board.js';
import PreviewPosition from './preview/position.js';

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

  #fen;
  #hash;
  #snpashot;

  constructor({ board, color, clock = 0, moveNum = 1 }) {
    defineValues(this, { board, color, clock, moveNum });
  }

  get fen() {
    return this.#fen || (this.#fen = `${this.board.notation} ${colors.format(this.color)} - - ${this.clock} ${this.moveNum}`);
  }

  get hash() {
    return this.#hash || (this.#hash = hashPosition(this));
  }

  get snapshot() {
    return this.#snpashot || (this.#snpashot = Object.freeze({
      board: this.board.snapshot,
      color: this.color,
      clock: this.clock,
      moveNum: this.moveNum,
    }));
  }

  ply(from, to) {
    return this.board.ply(from, to);
  }

  preview(ply) {
    return new PreviewPosition(this, ply);
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
