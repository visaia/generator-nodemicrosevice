var router = require('koa-router')();
var dinnerNumController = require('./dinnerNumController');
router.post('/dinnerNum/bookedSomeDay', dinnerNumController.bookedSomeDay);
router.post('/dinnerNum/bookedThisDay', dinnerNumController.bookedThisDay);
router.post('/dinnerNum/bookedUneatedThisDay', dinnerNumController.bookedUneatedThisDay);
router.post('/dinnerNum/eatedThisDay', dinnerNumController.eatedThisDay);

router.get('/bookList', dinnerNumController.bookList);

module.exports = router;