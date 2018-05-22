const BasicService = require('../../services/BasicService');
const DemoFlagSnModel = require('../../models/DemoFlagSnModel');
class DemoFlagSnService extends BasicService{
  constructor(){
    super(DemoFlagSnModel);
  }
}
module.exports = new DemoFlagSnService();
