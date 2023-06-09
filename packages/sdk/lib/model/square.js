import { pids, coordinates as c } from '../constant/index.js';

export default class Square {

  constructor(sid, pid) {
    this.sid = sid;
    this.pid = pid;
    Object.freeze(this);
  }

  get mirror() {
    return new Square(c.mirror(this.sid), pids.mirror(this.pid));
  }

  toString() {
    return `${pids.format(this.pid)}/${c.format(this.sid)}`;
  }
  
}
