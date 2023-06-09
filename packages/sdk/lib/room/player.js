export default class Player {

  constructor(color, { type, ui, ...profile } = {}) {
    this.color = color;
    this.profile = Object.freeze(profile);
    if (type) {
      this.type = type;
    }
    this.ui = !!ui;
    Object.freeze(this);
  }

}
