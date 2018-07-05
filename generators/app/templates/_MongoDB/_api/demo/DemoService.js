const BasicService = require('../../services/BasicService');
const DemoModel = require('../../models/DemoModel');
class DemoService extends BasicService{
    constructor(){
        super(DemoModel);
    }
}
module.exports = new DemoService();