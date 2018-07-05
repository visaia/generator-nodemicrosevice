var Models = require('../models/Models');
var sequelize = require('../config/db').store;
const logUtil = require('../utils/LogUtil');<% if (includeWebsocket) { %>
let IListener = require("../ipc/IListener");<% } %>

class BasicService {
    constructor(modelName) {
        this.modelName = modelName;
    }
    /**
     * 创建单个对象。
     * @param {*} object 
     */
    create(object, transaction) {
        if(transaction)
            return Models[this.modelName].create(object, {transaction:transaction});
        else 
            return Models[this.modelName].create(object);
    }

    /**
     * 更新
     * @param {*} object 
     */
    update(object){

        return Models[this.modelName].update(object,{
            where:{
                id:object.id
            }
        });
    }

    /**
     * 删除
     * @param {*} object
     */
    destroy(id){
        return Models[this.modelName].destroy({
            where:{
                id:id
            }
        });
    }


    /**
     * 查找所有对象。
     * @param {*} condition 
     */
    findAll(condition, transaction) {
        if (transaction){
            return Models[this.modelName].findAll({
                where:condition,
                transaction: transaction
            });
        } else {
            return Models[this.modelName].findAll({
                where:condition
            });
        }
        
    }

    findById(id){
        return Models[this.modelName].findOne({
            where:{id:id}
        });
    }
    findOne(where){
        return Models[this.modelName].findOne({
            where:where
        });
    }
    /**
     * 分页查询
     * @param {*} params 
     * @param {number} pageNum 页号
     * @param {number} pageCount  每一页的个数
     */
    findByPage(params,order,pageNum,pageCount){
        return Models[this.modelName].findAndCountAll({
            where:params,
            order:order,
            offset: (pageNum-1)*pageCount,
            limit: pageCount
        });
    }

    /**
     * 获取一个事务
     */
    transaction(autocommit){
        if( autocommit === undefined ){
            autocommit = true;
        }
        if( autocommit === true ){
            return function(hander){
                return new Promise((resolve,reject)=>{
                    logUtil.debug("get transaction");
                    sequelize.transaction({
                        autocommit:true
                    },function (t) {
                        logUtil.debug("get transaction success");
                        return hander(t);
                    })
                    .then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        logUtil.logErrorWithoutCxt(JSON.stringify(error));
                        reject(error);
                    });
                });
            }
        }else{
            return sequelize.transaction({
                autocommit:false
            });
        }
    }

<% if (includeWebsocket) { %>
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
    }<% } %>
}

module.exports = BasicService;