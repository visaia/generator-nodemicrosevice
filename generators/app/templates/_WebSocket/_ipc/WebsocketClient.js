var W3CWebSocket = require('websocket').w3cwebsocket;
let IPCHelper = require('./IPCHelper');
let IListener = require('./IListener');
let MSG_TYPE = require('../common/Var').MSG_TYPE;
let ws=require('../config/WSConfig');
let _ = require('lodash');
const uuidV1 = require('uuid/v1');
let connMap = new Map();
let callBackMap = new Map();//<msgType, array>

class WebsocketClient {

  constructor() {
    this.clear_callback_interval = 3000; //默认清理的时间间隔
    this.clear_callback_interval_obj = null;
  }

  async init() { //由库里存存着多个IP和端口，会有多个服务端
    this.connection(ws.wsClient.ip, ws.wsClient.port);
    setInterval(()=>{//删除超过3s没返回的回调函数
      callBackMap.forEach(function(ls, key){
        ls.forEach((ln, index)=>{
          if (ln.time && ((new Date().getTime() - ln.time) >= websocketClient.clear_callback_interval)){
            ls.splice(index, 1);
          }
        });
        if (ls.size <= 0){
          callBackMap.delete(listener._msgType);
        }
      });
    }, this.clear_callback_interval);
  }

  connection(ip, port, machineId) {
    let client = new W3CWebSocket('ws://' + ip + ':' + port);
    let _machine = { ip: ip, port: port, id: machineId };
    //监听webSocket状态 连接-断开-异常
    client.onerror = function(e) {
      // logService.error('Connection Error:  ' + e);
      //重联，如果出错
      // this.connection(ip, port);
      console.error('connetion error: ');
      connMap.forEach((conn, ip)=>{
        if (client == conn){
          connMap.delete(ip);
          let ls = callBackMap.get(MSG_TYPE.ERROR_WEBSOCKET);
          if (ls){
            ls.forEach((l)=>{
              l._callback.call(l._scope ? l._scope : null, _machine);
            });
          }
        }
      });
    }.bind(this);

    client.onopen = function() { //缓存着联接。
      connMap.set(ip, client);
      let ls = callBackMap.get(MSG_TYPE.OPEN_WEBSOCKET);
      if (ls){
        ls.forEach((l)=>{
          l._callback.call(l._scope ? l._scope :null, _machine);
        });
      }
    };
    client.onclose = function() {//需要把此联接由map移除。
      connMap.forEach((conn, ip)=>{
        if (client == conn){
          connMap.delete(ip);
          let ls = callBackMap.get(MSG_TYPE.CLOSE_WEBSOCKET);
          if (ls){
            ls.forEach((l)=>{
              l._callback.call(l._scope ? l._scope :null, _machine);
            });
          }
        }
      });
      //移除websocket状态监听
      //this.removeListener();
      //并且重联。
      this.connection(ip, port, machineId);
    }.bind(this);

    client.onmessage = function(e) {
      if (typeof e.data === 'string') {
        let data = null;
        try {
          data = JSON.parse(e.data);
        } catch (error) {
          // logService.error('parse data error: '+error);
          return;
        }

        let msgType = data.msgType;
        let ln = callBackMap.get(msgType);
        if (ln){
          //调用发送消息后等待中间回复&对中间件特别事件监听
          if (_.isArray(ln) && ln.length!==0){
            ln.forEach((l)=>{ //l is IListener.
              if(l._callback!==undefined){
                l._callback.call(l._scope ? l._scope : {}, data);
              }
            });
          }else if(ln._callback!==undefined){//单个监听者时候，暂时没用。
            ln._callback.call(ln._scope ? ln._scope : {}, data);
          }
        }
        //设用方法名来做监听的。
        IPCHelper.handleMsg(data);
      }
    };
  }

  toMid(listener) {
    if (!_.isObject(listener)) {
      return;
    }
    if (!listener instanceof IListener) {
      throw new Error('listener isn\'t IListener!');
    }
    connMap.forEach((conn, ip) => {
      if (conn.readyState === conn.OPEN) {
        let tmpData = { msgType: listener._msgType, data: listener._data };
        tmpData = this.wrapperMsg(tmpData);
        tmpData = JSON.stringify(tmpData);
        conn.send(tmpData);
        if (callBackMap.has(listener._msgType)){
          let ls = callBackMap.get(listener._msgType);
          for (var index = 0; index < ls.length; index++) {
            var element = ls[index];
            if (element == listener)
              return;
          }
          listener.time = new Date().getTime();
          ls.push(listener);
        } else {
          listener.time = new Date().getTime();
          let ls = [listener];
          callBackMap.set(listener._msgType, ls);
        }
      } else {
        //error message.
      }
    }, this);
  }

  wrapperMsg(data){
    return {
      "msgType": data.msgType,
      "version": "v1.0.0",
      "timestamp": new Date(),
      "data": data.data,
      "msgId": uuidV1()
    };
  }
  //只监听websocket状态（on, close, error），特别时候调用，建议使用IPCHelper.register
  on(listener){
    if (!listener instanceof IListener){
      throw new Error('listener isn\'t IListener!');
    }
    //handle multiple listner.
    if (callBackMap.has(listener._msgType)){
      let ls = callBackMap.get(listener._msgType);
      for (var index = 0; index < ls.length; index++) {
        var element = ls[index];
        if (element == listener)
          return;
      }
      ls.push(listener);
    } else{
      let ls = [listener];
      callBackMap.set(listener._msgType, ls);
    }
  }

  //不监听websocket信息
  off(listener) {
    if (!listener instanceof IListener) {
      throw new Error('listener isn\'t IListener!');
    }
    if (callBackMap.has(listener._msgType)){
      let ls = callBackMap.get(listener._msgType);
      ls.forEach((ln, index)=>{
        if (ln == listener){
          ls.splice(index, 1);
        }
      });
      if (ls.size <= 0){
        callBackMap.delete(listener._msgType);
      }
    }
  }
}

let websocketClient = new WebsocketClient();
module.exports = websocketClient;
