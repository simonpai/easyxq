export default class Variable {

  constructor(fn, props = {}) {
    Object.assign(this, props);
    this._fn = fn;
    Object.freeze(this);
  }

  evaluate(args) {
    return this._fn(args);
  }

  explain(args) {
    const { name } = this;
    return `${ name ? `${name}:` : ''}${this.evaluate(args)}`;
  }

}
