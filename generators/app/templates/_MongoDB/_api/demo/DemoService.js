const BasicService = require('../../services/BasicService');<% if(includeWebsocket) { %>
const WSBasicService = require('../../services/WSBasicService');<% } %>
const DemoModel = require('../../models/DemoModel');
class DemoService extends BasicService{
    constructor(){
        super(DemoModel);
    }
}
module.exports = new DemoService();