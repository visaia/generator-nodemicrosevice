/**
 * http://192.168.20.73/ 人事，正式
 * http://192.168.20.67/ bpm 测试
 * http://bpm.ceway.com.cn/ bpm 正式
 */
//let hrUrl = "http://192.168.20.73/";
let hrUrl = "http://ehr.ceway.com.cn:8090/";
let bpmUrl = "http://192.168.20.67/";
let fileServer = "http://localhost:3003/";
let testUrl = "http://localhost:3007/";
let facePersonUrl="http://api.youtu.qq.com/youtu/api/"
module.exports = {
    login:hrUrl+"external/login",
    getAllUser:hrUrl+"external/getAllUser",
    tokenCheck:"http://192.168.20.58:9001/"+"api/token/checkToken.do",
    tokenListCheck:"http://192.168.20.58:9001/"+"api/token/checkTokens.do",
    // tokenCheck:bpmUrl+"api/checkToken.mvc",
    // tokenListCheck:bpmUrl+"api/checkTokens.mvc",
    getToken:bpmUrl+"api/req.mvc",
    vacationCheck:hrUrl+"external/getXiuJiaAndchuChaiAndWaiChuUserInfo",
    createPerson :facePersonUrl+"newperson",
    addFace:facePersonUrl+"addface",
    fileServer:fileServer
}
