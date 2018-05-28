"use strict";
const Sequelize = require('Sequelize');
const db = require('../config/db');
const store = db.getStore();
/**用户自定义报餐模板 */
const TestTemplate = store.define('test_template', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    test:{
        type:Sequelize.STRING,
        allowNull: false,
        comment:"测试字段",
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    defaultScope:{
        where: {
            isDelete: 0,
        }
    }
});

TestTemplate.sync({force: false});

module.exports = TestTemplate;