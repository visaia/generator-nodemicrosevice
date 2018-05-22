const RSUtil = require("./RSUtil");
const LogUtil = require("./LogUtil.js");
class CWError{
    constructor(errorMsg){
        this.errorMsg = errorMsg;
    }
}

function makeError(errorMsg){
    return new CWError(errorMsg);
}

function responseError(ctx,error,errorMsg){
    if( error instanceof CWError ){
        LogUtil.logErrorWithoutCxt(error.errorMsg);
        ctx.body = RSUtil.fail(error.errorMsg);
    }else{
        LogUtil.logErrorWithoutCxt(JSON.stringify(error));
        ctx.body = RSUtil.fail(errorMsg);
    }
}

module.exports = {
    makeError:makeError,
    responseError:responseError,
    CWError:CWError
};