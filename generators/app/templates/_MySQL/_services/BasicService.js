// var Models = require('../models/Models');
var sequelize = require('../config/db').store;
const logUtil = require('../utils/LogUtil');<% if (includeWebsocket) { %>
    let IListener = require("../ipc/IListener");
    const _ = require("lodash");<% } %>

class BasicService {
    constructor(model) {
        this.model = model;
    }
    /**
     * 创建单个对象。
     * @param {*} object
     */
    create(object, transaction) {
        if(transaction)
            return this.model.create(object, {transaction:transaction});
        else
            return this.model.create(object);
    }

    /**
     * 更新
     * @param {*} object
     */
    update(object){

        return this.model.update(object,{
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
        return this.model.destroy({
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
            return this.model.findAll({
                where:condition,
                transaction: transaction
            });
        } else {
            return this.model.findAll({
                where:condition
            });
        }

    }

    findById(id){
        return this.model.findOne({
            where:{id:id}
        });
    }
    findOne(where){
        return this.model.findOne({
            where:where
        });
    }

    /**
     * 查找最后一条或多条。
     * where 查询条件（例如：{ type = 3 }） 类型: Object
     * limit 获取条数（数字） 类型：int
     * order 排序条件 （以哪个字段进行排序，例如：type 或 time） 类型：string
     */
    findLastByOption(where,order,limit){
        return this.model.findAndCountAll({
            where:where,
            order:order,
            limit: limit
        });
    }


    /**
     * 求和。
     * field 求和字段 (value) 类型: string
     * where 查询条件（例如：{ type = 3 }） 类型: Object
     */
    sum(field,where){
        return this.model.sum(field,{
            where:where
        });
    }

    /**
     * 求统计查询结果数。
     * field 求和字段 (value) 类型: string
     * where 查询条件（例如：{ type = 3 }） 类型: Object
     */
    count(field,where){
        return this.model.count(field,{
            where:where
        });
    }

    /**
     * 求平均值。
     * field 求和字段 (value) 类型: string
     * where 查询条件（例如：{ type = 3 }） 类型: Object
     */
    async average(field,where){
        let sum = await this.sum(field,where);
        let count = await this.count(field,where);
        return sum/count
    }

    /**
     * 分页查询
     * @param {*} params
     * @param {number} pageNum 页号
     * @param {number} pageCount  每一页的个数
     */
    findByPage(params,order,pageNum,pageCount){
        return this.model.findAndCountAll({
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