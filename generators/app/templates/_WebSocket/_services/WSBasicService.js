let IListener = require("../ipc/IListener");

  class BasicService {

  register(events) {
    if (!_.isArray(events)) {
      throw new Error('events should be a array!');
    }
    let ipcHelper = require('../ipc/IPCHelper');
    ipcHelper.register(this, events);
  }

  //websocket是在子进程跑，所以需要子进程对象。
  toMid(listener){
    if (!listener instanceof IListener){
      throw new Error('listener isn\'t IListener!');
    }
    //_subprocess.send(data);
    let ipcHelper = require('../ipc/IPCHelper');
    ipcHelper.toMid(listener);
  }

  toRender(data){
    let ipcHelper = require('../ipc/IPCHelper');
    ipcHelper.toRender(data);
  }

  onWebsocket(listener){
    if (!listener instanceof IListener){
      throw new Error('listener isn\'t IListener!');
    }
    let WebsocketClient = require('../ipc/WebsocketClient');
    WebsocketClient.on(listener);
  }

  offWebsocket(listener){
    let WebsocketClient = require('../ipc/WebsocketClient');
    WebsocketClient.off(listener);
  }

}


module.exports = BasicService;
