let db = require('../db');
let _ = require('lodash');<% if (includeWebsocket) { %>
let IListener = require("../ipc/IListener");<% } %>

  class BasicService {

      constructor(entity) {
          if (_.isNull(entity) || !_.hasIn(entity, 'getTableName')) {
              return;
          }
          if (entity) {
              this.name = entity.getTableName();
              delete entity['getTableName'];
              this.model = db.model(this.name, entity);
          }
      }

      async create(entity) {
          try {
              let rs = await this.model.create(entity);
              return rs._doc;
          } catch (error) {
              return error;
          }
      }

      async createMany(entities) {
          if (!_.isArray(entities)) {
              throw 'createMany only support array!';
          }
          try {
              let rs = await this.model.insertMany(entities);
              let r = [];
              rs.forEach(function (_rs) {
                  r.push(_rs._doc);
              });
              return r;
          } catch (error) {
              return error;
          }
      }

      async update(entity) {
          try {
              let rs = await this.model.update(entity);
              return rs._doc;
          } catch (error) {
              return error;
          }
      }

      async updateOrCreate(condition, entity, option) {
          try {
              let rs = await this.model.update(condition, entity, option);
              return rs._doc;
          } catch (error) {
              return error;
          }
      }

      async remove(condition) {
          try {
              let rs = await this.model.remove(condition);
              return rs.result;
          } catch (error) {
              return error;
          }
      }

      async removeById(id) {
          try {
              let rs = await this.model.findOneAndRemove({_id: id});
              return rs.result;
          } catch (error) {
              return error;
          }
      }

      async findAll() {
          try {
              let _rs = await this.model.find();
              let r = [];
              _rs.forEach(function (_r) {
                  r.push(_r._doc);
              });
              return r;
          } catch (error) {
              return error;
          }
      }

      async findById(id) {
          try {
              let rs = await this.model.findById(id);
              return rs._doc;
          } catch (error) {
              return error;
          }
      }

      async findOne(condition) {
          try {
              let rs = await this.model.findOne(condition);
              return rs._doc;
          } catch (error) {
              return error;
          }
      }

      async findByCondition(condition) {
          try {
              let rs = await this.model.find(condition);
              let r = [];
              rs.forEach(function (_rs) {
                  r.push(_rs._doc);
              });
              return r;
          } catch (error) {
              return error;
          }
      }

      //
      async findInCondition(filed, condition) {
          if (!_.isArray(condition)) {
              throw 'condition is only superred by array!';
          }

          try {
              let _condition = {filed: {$in: condition}};
              let rs = await this.model.find(_condition);
              let r = [];
              rs.forEach(function (_rs) {
                  r.push(_rs._doc);
              });
              return r;
          } catch (error) {
              throw error;
          }
      }

      async countByCondition(condition) {
          try {
              let count = await this.model.count(condition);
              return count;
          } catch (error) {
              return error;
          }
      }


      async pageByCondition(condition, pageIndex, pageSize) {
          let count = await this.countByCondition(condition);
          if (count == 0) {
              return {rs: [], total: 0};
          }
          if (_.isUndefined(pageSize) || _.isNull(pageSize) || _.isEmpty(pageSize))
              pageSize = 10;

          if (_.isUndefined(pageIndex) || _.isNull(pageIndex) || _.isEmpty(pageIndex))
              pageIndex = 1;

          let skip = pageSize * (pageIndex - 1);

          try {
              let rs = await this.model.find(condition).limit(pageSize).skip(skip);
              let r = [];
              rs.forEach(function (_rs) {
                  r.push(_rs._doc);
              });
              return {rs: r, total: count}
          } catch (error) {
              return error;
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
