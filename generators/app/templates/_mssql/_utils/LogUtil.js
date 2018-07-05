const log4js = require('log4js');
const lodash = require('lodash');
const log_config = require('../config/log');

//加载配置文件
log4js.configure(log_config);


var errorLogger = log4js.getLogger('errorLogger');
var resLogger = log4js.getLogger('resLogger');
var debugLogger = log4js.getLogger('debugLogger');
var dbLogger = log4js.getLogger('dbLogger');

//封装错误日志
var logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装错误日志，不需要ctx
var logErrorWithoutCxt = function (error, errorMsg) {
    if (error) {
        let str = '\n *************** response log start *************** \n';
        if (lodash.isObject(error)){
            error = JSON.stringify(error);
        }
        str += 'error:  ' + error;
        str += 'errorMsg: ' + errorMsg;
        errorLogger.error(str);
    }
};


//封装响应日志
var logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};

//调试信息输出
var debug = (msg) => {
    debugLogger.debug(msg);
}

//DB信息输出
var dbInfo = (msg) => {
    dbLogger.info(msg);
}


var logUtil = {
    logError: logError,//with cxt
    logErrorWithoutCxt: logErrorWithoutCxt,
    logResponse: logResponse,
    debug: debug,
    dbInfo: dbInfo
};


//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String();

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    return logText;

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.fields) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

module.exports = logUtil;