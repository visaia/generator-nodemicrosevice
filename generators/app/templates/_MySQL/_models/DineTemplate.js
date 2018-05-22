"use strict";
const Sequelize = require('Sequelize');
const db = require('../config/db');
const store = db.getStore();
/**用户自定义报餐模板 */
const DineTemplate = store.define('cw_dine_template', {
    id : {
        type : Sequelize.INTEGER, 
        autoIncrement : true, 
        primaryKey : true
    },
    userId:{
        type:Sequelize.INTEGER,
        field: 'user_id',
        comment:"用户id",
    },
    disable:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1,
        comment:"模板开关 0-模板不生效 1-模板自动生效"
    },
    date:{
        type: Sequelize.INTEGER,
        allowNull:false,
        comment:"周一至周日 1-7"
    },
    breakfast:{
        type: Sequelize.INTEGER,
        allowNull:false,
        comment:"早餐: 0-不报 1 -报"
    },
    lunch:{
        type: Sequelize.INTEGER,
        allowNull:false,
        comment:"午餐: 0-不报 1 -报"
    },
    dinner:{
        type: Sequelize.INTEGER,
        allowNull:false,
        comment:"晚餐: 0-不报 1 -报"
    },
    breakfastLocationId: {
        type: Sequelize.INTEGER,
        field: 'breakfast_location_id',
        comment: "早餐报餐地点",
    },
    lunchLocationId: {
        type: Sequelize.INTEGER,
        field: 'lunch_location_id',
        comment: "午餐报餐地点",
    },
    dinnerLocationId: {
        type: Sequelize.INTEGER,
        field: 'dinner_location_id',
        comment: "晚餐报餐地点",
    },
    isDelete:{
        type:Sequelize.INTEGER, 
        allowNull:false,
        field: 'is_delete',
        defaultValue:0,
        comment:"是否该记录被删除, 0-未删除 1-删除",
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    defaultScope:{
        where: {
            isDelete: 0,
        }
    },
    indexes:[{
      name:"cw_dine_template_userId_index",
      method:"BTREE",
      fields:["user_id"]
    }]
});

DineTemplate.sync({force: false});

module.exports = DineTemplate;