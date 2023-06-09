export default class InvalidPlyError extends Error {

  // TODO: code
  constructor(message, data) {
    super(message);
    this.name = 'InvalidPlyError';
    this.data = data;
  }

}
