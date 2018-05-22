const WebSocketServer = require('ws').Server;
const {Observable, Observer, Subject } = require('rxjs');
const IPCHelper = require('./IPCHelper');
let _ = require('lodash');
const pools = new Set();
let ws=require('../config/WSConfig');

/**
 * 启动一个websocket server.
 */
class Server {

  start() {
    let Server = new WebSocketServer({ port: ws.wsServer.port });
    let observervable = Observable.fromEvent(Server, 'connection');
    observervable.subscribe(this.handle, (error)=>{
      console.log('errro:  '+error);
    });
  }

  //hand connection event when the clint connected to this server..
  handle(ws){
    pools.add(ws);
    let message =  Observable.fromEvent(ws, 'message');
    message.subscribe(data => {//接受客户端的请求。
      try {
        data = JSON.parse(data.data);
      } catch (error) {
        return;
      }
      //转发给相对应的监听器。
      IPCHelper.handleMsg(data);
    });

    let close =  Observable.fromEvent(ws, 'close');
    close.subscribe(event => {
      pools.delete(ws);
    });

    let error =  Observable.fromEvent(ws, 'error');
    error.subscribe(event => {
      pools.delete(ws);
    });
  }

  toRender(data){
    if(_.isObject(data)){
      data = JSON.stringify(data);
    }
    pools.forEach(conn =>{
      conn.send(data);
    });
  }

}
let server = new Server();
// server.start();
module.exports =  server;
