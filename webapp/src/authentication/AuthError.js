export default class AuthError extends Error {
    constructor( errorCode, errors, ...params) {
      super(...params);
      this.name = 'AuthError';
      this.errorCode = errorCode;
      this.errors = errors;
      this.date = new Date();
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, AuthError);
      }
    }
    getErrorsObj(){
      const retObj = {};
      if(!this.errors || !Array.isArray(this.errors)){
        return retObj;
      }
      this.errors.forEach(el => {
        if(retObj[el.field]){
          retObj[el.field] += '<br/>';
        }else{
          retObj[el.field] = '';
        }
        retObj[el.field] += el.message
      })
      return retObj;
    }
  }
  