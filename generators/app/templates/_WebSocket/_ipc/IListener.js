class IListener{
  //_msgType = null;//消息类型
  //_data = null;//发送数据
  //_callback = null;//回调函数
  constructor(msgType, data, callback, scope){
    this._msgType = msgType;
    this._data = data;
    this._callback = callback;
    this._scope = scope;
  }
}

module.exports = IListener;
