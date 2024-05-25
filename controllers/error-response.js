// defines  new class errorResponse that inherits  all  the built-in properties and methods from the Error class.
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message), (this.statusCode = statusCode);
  }
}
module.exports = ErrorResponse;
