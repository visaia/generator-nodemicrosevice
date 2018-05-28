'use strict';
const Sequelize = require('Sequelize');
const store = require('../../config/db').store;
const TestTemplate = require('../../models/TestTemplate.js');
const ErrorUtil =  require("../../utils/ErrorUtil");
const BasicService = require('../../services/BasicService');<% if(includeWebsocket) { %>
const WSBasicService = require('../../services/WSBasicService');<% } %>
const lodash = require('lodash');
const moment = require('moment');
class TestService extends BasicService{
    constructor(){
        super('TestTemplate');
    }
}
module.exports = new TestService();