var router = require('koa-router')();
var controller = require('./controller');
router.get('/health', controller.checkHealth);

module.exports = router;