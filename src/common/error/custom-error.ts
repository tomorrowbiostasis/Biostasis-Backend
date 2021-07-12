import {ValidationError} from 'joi';

export class CustomError extends Error {
  public error: object | ValidationError;
  public message: string;
  private readonly httpCode: number;

  constructor(
    message: string,
    error: object | ValidationError,
    httpCode: number = 400,
  ) {
    super();
    this.message = message;
    this.httpCode = httpCode;
    this.error = error;
  }

  getStatus() {
    return this.httpCode;
  }
}
