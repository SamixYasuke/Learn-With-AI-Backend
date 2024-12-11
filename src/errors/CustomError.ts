/**
 * A custom Error Handler for different type of http errors
 * @param payload - (message: string, statusCode: number)
 */
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
