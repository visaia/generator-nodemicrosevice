let _ = require('lodash');
let IListener = require('./IListener');
const _var = require('../common/Var');

let BasicService = null;
let CncManageService = null; // cnc机台管理注册事件
let CncCardMesService = null; // cnc卡片注册事件

const eventMap = new Map();
let websocketClient = null;
class IPCHelper{
  /**
   * 初始化
   * 1. 先保证初始化websocket。
   * 2. 初始化service.
   */
  static init(){
    websocketClient = require('../ipc/WebsocketClient');
    //监听所有联接必须联接上才工作。
    let connection = 0;
    websocketClient.on(new IListener(_var.MSG_TYPE.OPEN_WEBSOCKET, null, ()=>{
      connection++;
    }));

    websocketClient.off(new IListener(_var.MSG_TYPE.CLOSE_WEBSOCKET, null, ()=>{
      connection--;
    }));

    // let machines = MachineUtil.getMachines();
    //  if (!_.isArray(machines)){
    //      console.error('There is no ip can\'t be found!');
    //      return;
    //  }
    websocketClient.init();

    let times =  setInterval(()=>{
      if (connection == 1){
        console.log('length:.....'+connection);
        clearInterval(times);
        times = null;
        //保证websocket初始完成后，才初始化service
        // BasicService = require('../services/BasicService');
        CncManageService = require('../services/CncManageService'); // cnc机台管理注册事件
        CncCardMesService = require('../services/CncCardMesService'); // cnc卡片注册事件
      }
      console.log('connetion....');
    }, 1000);
  }

  static handleMsg(data){
    // let BasicService = require('../services/BasicService');
    try {
      this.handleWebsocketAndUIMessage(data);
    } catch (error) {
      // logService.error('error for invoke method: '+error);
      console.log(error);
    }
  }

  static toMid(data){
    //_subprocess.send(data);
    websocketClient.toMid(data);
  }

  static toRender(data){
    let server = require('../ipc/Server');
    server.toRender(data);
  }

  // static async getAllMachine(){
  //   let machineService = require('../services/MachineService');
  //   let machines = await machineService.findAll();
  //   return machines;
  // }

  /**
   * 处理中间件或者UI发来的数据，然后会调相对应的service处理。
   * data: {type:..., data: ...}
   */
  static handleWebsocketAndUIMessage(data) {
    let type = data.msgType;
    //let eventMap = BasicService.eventMap;
    if (eventMap.has(type)) {

      let ls = eventMap.get(type);
      ls.forEach((service) => {
        let method = service[type];
        if (method && _.isFunction(method)) {
          method.call(service, data);
        }
      });
    }
  }

  //会监听中间件&前前端数据， 方法名和事件类型一至。
  static register(service, events){
    events.forEach(function (eventName) {
      if (eventMap.has(eventName)) {//预防多个对象，用同一个监听
        let ls = eventMap.get(eventName);
        for (var index = 0; index < ls.length; index++) {
          var element = ls[index];
          if (element == service) {
            return;
          }
        }
        ls.push(service);
      } else {
        let ls = [service];
        eventMap.set(eventName, ls);
      }
    });
  }
}

module.exports = IPCHelper;
