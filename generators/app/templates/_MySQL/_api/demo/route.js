var router = require('koa-router')();
var testController = require('./testController');
router.post('/create', testController.testCreate);
router.get('/bookList', testController.bookList);

module.exports = router;