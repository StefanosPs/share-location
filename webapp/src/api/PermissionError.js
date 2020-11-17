export default class PermissionError extends Error {
    constructor( errorCode, ...params) {
      super(...params);
      this.name = 'PermissionError';
      this.errorCode = errorCode;
      this.date = new Date();
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, PermissionError);
      }
    }

    getMessage(){
      return `Permission error: ${this.message}`;
    }
  }
  