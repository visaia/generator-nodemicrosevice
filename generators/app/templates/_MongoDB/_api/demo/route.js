var router = require('koa-router')();
var DemoController = require('./DemoController');
router.get('/demo/list/:pageIndex', DemoController.list);
router.post('/demo/create', DemoController.create);
router.post('/demo/update', DemoController.update);
router.get('/demo/delete/:pageIndex/:id', DemoController.delete);
router.get('/demo/findFlagSn', DemoController.findFlagSn);
router.post('/demo/createFlagSn', DemoController.createFlagSn);
router.post('/demo/updateLatestSn', DemoController.updateLatestSn);

module.exports = router;
