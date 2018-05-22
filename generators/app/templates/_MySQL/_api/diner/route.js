var router = require('koa-router')();
var dinerController = require('./dinerController');
var dinnerNumController = require('./dinnerNumController');
router.get('/diner/getAddress', dinerController.getDinerAddress);
router.post('/diner/addAddress', dinerController.addDinerAddress);
router.post('/diner/getAddressByName', dinerController.getAddressByName);
router.post('/diner/updateAddress', dinerController.updateDinerAddress);
router.post('/diner/removeAddress', dinerController.removeDinerAddress);
router.post('/diner/getBookMealRecord', dinerController.getBookMealRecord);
router.post('/diner/getBookMealRecordList', dinerController.getBookMealRecordList);
router.post('/diner/bookMeal', dinerController.bookMeal);
router.post('/diner/bulkBookMeal', dinerController.bulkBookMeal);
router.post('/diner/getTemplates', dinerController.getDineTemplate);
router.post('/diner/updateTemplates', dinerController.updateDineTemplate);
router.get('/diner/judgeMealTime/:location', dinerController.judgeMealTime);
router.get('/diner/getTodayBookMealRecord', dinerController.getTodayBookMealRecord);

router.post('/dinnerNum/bookedSomeDay', dinnerNumController.bookedSomeDay);
router.post('/dinnerNum/bookedThisDay', dinnerNumController.bookedThisDay);
router.post('/dinnerNum/bookedUneatedThisDay', dinnerNumController.bookedUneatedThisDay);
router.post('/dinnerNum/eatedThisDay', dinnerNumController.eatedThisDay);

module.exports = router;