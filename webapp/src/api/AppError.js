export default class AppError extends Error {
    constructor( errorCode, errors, ...params) {
      super(...params);
      this.name = 'AppError';
      this.errorCode = errorCode;
      this.errors = errors;
      this.date = new Date();
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, AppError);
      }
    }
  }
  