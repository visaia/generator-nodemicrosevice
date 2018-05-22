'use strict';
const Sequelize = require('Sequelize');
const store = require('../../config/db').store;
const DineAddress = require('../../models/DineAddress');
const User = require('../../models/User.js');
const BookMeal = require('../../models/BookMeal.js');
const DineTemplate = require('../../models/DineTemplate.js');
const ErrorUtil =  require("../../utils/ErrorUtil");
const BasicService = require('../../services/BasicService');
const lodash = require('lodash');
const moment = require('moment');
class DinerService extends BasicService{
    constructor(){
        super('DineAddress');
    }

    async getUserListWidthBookMealRecord(queryParams){
        
    }

    async addDineAddress(address){
        addressCheck(address);
        let find = await DineAddress.findOne({
            where:{ name:address.name}
        });
        if( find ){
            throw ErrorUtil.makeError("地点名称重复");
        }
        return DineAddress.create(address);
    }

    async updateDineAddress(address){
        addressCheck(address);
        if( !lodash.isNumber(address.id) ){
            throw ErrorUtil.makeError("地址id无效");
        }
        let find = await DineAddress.findOne({
            where:{ name:address.name}
        });
        if( find && find.id !== address.id){
            throw ErrorUtil.makeError("地点名称重复");
        }
        let result = await DineAddress.update(address,{
            where:{id:address.id}
        });
        if( result[0] === 0 ){
            throw ErrorUtil.makeError("更新失败");
        }
        return result;
    }

    /**
     * 
     * @param {{userId:null,startTime:null,endTime:null}} params 
     */
    async getBookMealRecord(params){
        let userId = params.userId;
        let startTime = params.startTime;
        let endTime = params.endTime;
        startTime = moment(startTime);
        startTime = startTime.startOf("date");
        endTime = moment(endTime);
        endTime = endTime.startOf("date");
        let result = await BookMeal.findAll({
            where:{
                userId:userId,
                declareDate:{
                    $between:[startTime.toDate(),endTime.toDate()]
                }
            }
        });
        return result;
    }

    /**
     * 查询当天的所有报餐记录
     */
    async getTodayBookMealRecord(){
        let now = moment().startOf("day");
        let sql = "select U.job_number,U.serial_number,M.* from cw_book_meal as M left join user as U on M.user_id = U.id where M.declare_date = :date";
        let result = await store.query(sql,{
            type:Sequelize.QueryTypes.SELECT,
            replacements:{
                date:now.toDate()
            },
        });
        return result.map(function(item){
            return {
                id:item.id,
                jobNumber:item["job_number"],
                serialNumber:item["serial_number"],
                userId:item["user_id"],
                declareDate:item["declare_date"],
                breakfast:item.breakfast,
                lunch:item.lunch,
                dinner:item.dinner,
                breakfastLocationId:item["breakfast_location_id"],
                lunchLocationId:item["lunch_location_id"],
                dinnerLocationId:item["dinner_location_id"],
            };
        });
    }

    /**
     * 批量查询用户报餐记录(一次返回一周的报餐信息)
     */
    async getBookMealRecordList(params){
        let pageNum = params.pageNum || 1;
        let pageCount = params.pageCount || 5;
        let startDate = moment( params.startDate );
        let endDate = moment( params.endDate );
        if( 1 !== startDate.day() || 0 !== endDate.day() ){
            throw ErrorUtil.makeError("起始时间不是周一至周日");
        }
        let orgTitle = params.orgTitle;
        let where = {};
        let userList = [];
        where.declare_date = {
            $between: [startDate.toDate(), endDate.toDate()]
        }
        if( "name" in params && undefined !== params.name && null !== params.name && "" !== params.name){
            userList = await User.findAndCount({
                where:{
                    $or : [{
                        jobNumber:{$like:"%"+params.name+"%"}
                    },{
                        userName:{$like:"%"+params.name+"%"}
                    }]
                },
                offset: (pageNum-1)*pageCount,
                limit: pageCount
            });
            where.$or = userList.rows.map(function(user){
                return {userId:user.id};
            });
        }else if( undefined !== orgTitle && null !== orgTitle && "" !== orgTitle){
            userList = await User.findAndCount({
                where:{
                    orgTitle:orgTitle
                },
                offset: (pageNum-1)*pageCount,
                limit: pageCount
            });
            where.$or = userList.rows.map(function(user){
                return {userId:user.id};
            });
        }else{
            userList = await User.findAndCount({
                where:{},
                offset: (pageNum-1)*pageCount,
                limit: pageCount
            });
            where.$or = userList.rows.map(function(user){
                return {userId:user.id};
            });
        }

        let recordList = await BookMeal.findAndCount({
            where:where,
            order:"declare_date ASC"
        });

        let data = {
            rows:[],count:userList.count
        };
        userList.rows.forEach(function(user){
            let oneUserBookMealRecords = recordList.rows.filter(function(record){
                return record.userId === user.id;
            });
            //检查报餐信息是否够一周(0是周日)
            if(oneUserBookMealRecords.length !== 7 ){
                let tempDate = new Array(7);
                for(let i = 0; i < 7; ++i ){
                    let find = oneUserBookMealRecords.find(function(item){
                        return i === moment(item.declareDate).day();
                    });
                    if( undefined !== find ){
                        tempDate[i] = find;
                    }else{
                        //此用户此日无报错信息，构造一个没有报任何餐的数据来填充
                        tempDate[i] = {
                            "id": Date.now()+ Math.floor( Math.random()*10000 ),
                            "userId": user.id,
                            "declareDate": startDate.clone().add(i,"day"),
                            "breakfast": 0,
                            "breakfastStatus": 0,
                            "breakfastLocationId": null,
                            "breakfastRealLocationId": null,
                            "breakfastIsCost": 0,
                            "lunch": 0,
                            "lunchStatus": 0,
                            "lunchLocationId": null,
                            "lunchRealLocationId": null,
                            "lunchIsCost": 0,
                            "dinner": 0,
                            "dinnerStatus": 0,
                            "dinnerLocationId": null,
                            "dinnerRealLocationId": null,
                            "dinnerIsCost": 0,
                            "isDelete": 0,
                            "createdAt": new Date(),
                            "updatedAt": new Date()
                        };
                    }
                }
                let Sunday = tempDate[0];
                tempDate.splice(0,1);
                tempDate.push(Sunday);
                oneUserBookMealRecords = tempDate;
            }
            user.dataValues.bookMealList = oneUserBookMealRecords;
            data.rows.push(user);
        });
        
        return data;
    }
    /**
     * 用户报餐
     * @param{[]} bookMealDataList
     */
    async bookMeal(bookMealDataList){
        let checkResultPromise = [];
        bookMealDataList.forEach((bookMealData)=>{
            checkResultPromise.push( checkBookMeal(bookMealData) );
        });
        let result = await Promise.all(checkResultPromise);
        let thisService = this;
        let transaction = this.transaction(true);
        return transaction(async function(t){
            for(let i = 0 ; i<bookMealDataList.length;++i){
                let bookMealData = bookMealDataList[i];
                //更新旧记录
                if( bookMealData.id ){
                    await BookMeal.update(bookMealData,{
                        where:{
                            id:bookMealData.id
                        },
                        transaction:t,
                    });
                }else{
                    //新报餐记录
                    bookMealData.breakfastStatus = 0;
                    bookMealData.lunchStatus = 0;
                    bookMealData.dinnerStatus = 0;
                    let newReocrd = await BookMeal.create(bookMealData,{transaction:t});
                    //检查是否有重复报餐的情况
                    let checkRecordList = await BookMeal.findAll({
                        where:{
                            userId:newReocrd.userId,
                            declareDate:newReocrd.declareDate
                        },
                        transaction:t
                    });
                    if( checkRecordList.length !== 1 ){
                        throw ErrorUtil.makeError("重复报餐");
                    }
                }
            }
            return true;
        });
    }

    /**
     * 批量报餐
     */
    async bulkBookMeal(bookMealData){
        let userIdList = bookMealData.userIdList;
        let startDate =  moment(bookMealData.startDate);
        let endDate = moment(bookMealData.endDate);
        let bookDate = bookMealData.bookDate;
        let transaction = this.transaction();
        return transaction(async function(t){
            let start = startDate.clone().startOf("date");
            let end = endDate.clone().startOf("date");
            for(let i = 0 ; i < userIdList.length; ++i){
                let userId = userIdList[i];
                start = startDate.clone().startOf("date");
                end = endDate.clone().startOf("date");
                do{    
                    for(let i = 0 ; i < 7 ; ++i ){
                        await bulkBookMealOneDay.apply(
                            {declareDate:start.clone()},
                            [userId,bookMealData,bookDate[i],t]
                        );
                        start.add(1,"day").startOf("date");
                    }
                }while( start.isSameOrBefore(end) )
            }
            return true;
        });
    }
    async getDineTemplate(userId){
        return DineTemplate.findAll({
            where:{
                userId:userId
            },
            order:"date ASC"
        });
    }

    /**
     * @param{[]} templates
     */
    async updateDineTemplate(templates){
        checkDinerTemplate(templates);
        let transaction = this.transaction();
        return transaction(function(t){
            return DineTemplate.findAll({
                where:{ userId:templates[0].userId},
                order:"date ASC"
            })
            .then( function(resultList){
                let promiseList = [];
                if( resultList.length === 0 ){
                    //新增
                    templates.forEach( function(item){
                        let p = DineTemplate.create(item,{
                            transaction:t
                        });
                        promiseList.push(p);
                    });
                }else{
                    //更新
                    resultList.forEach( (item,index)=>{
                        let p = item.update(templates[index],{
                            transaction:t
                        });
                        promiseList.push(p);
                    });
                }
                return Promise.all(promiseList);
            });
        });
    }

    /**
     * judge the time is meal time or not.
     * return: false||true
     */
    async judgeMealTime(location){
        let addressInfo = await super.findOne({ name:location});
        if(lodash.isEmpty(addressInfo)){
            throw "没有定义地址数据";
        }
        // //breakfast begining
        // let breakfastStartTimeHour = addressInfo.breakfastStartTimeHour;
        // let breakfastStartTimeMinute = addressInfo.breakfastStartTimeMinute;
        // //breakfast end
        // let breakfastEndTimeHour = addressInfo.breakfastEndTimeHour;
        // let breakfastEndTimeMinute = addressInfo.breakfastEndTimeMinute;

        // //lunch begining
        // let lunchStartTimeHour = addressInfo.lunchStartTimeHour;
        // let lunchStartTimeMinute = addressInfo.lunchStartTimeMinute;
        // //lunch end
        // let lunchEndTimeHour = addressInfo.lunchEndTimeHour;
        // let lunchEndTimeMinute = addressInfo.lunchEndTimeMinute;

        // //supper begining
        // let supperStartTimeHour =  addressInfo.supperStartTimeHour;
        // let supperStartTimeMinute = addressInfo.supperStartTimeMinute;
        // //supper end
        // let supperEndTimeHour = addressInfo.supperEndTimeHour;
        // let supperEndTimeMinute = addressInfo.supperEndTimeMinute;
        
        let now = moment();

        //judge breakfast time.
        if (this.isBreakFastTime(addressInfo, now)){
            return true;
        } else if (this.isLunchTime(addressInfo, now)){
            return true;
        } else if (this.isSuperTime(addressInfo, now)){
            return true;
        }
        return false;
    }

    //is breakfast time.
    isBreakFastTime(addressInfo, now){
        //breakfast begining
        let breakfastStartTimeHour = addressInfo.breakfastStartTimeHour;
        let breakfastStartTimeMinute = addressInfo.breakfastStartTimeMinute;
        //breakfast end
        let breakfastEndTimeHour = addressInfo.breakfastEndTimeHour;
        let breakfastEndTimeMinute = addressInfo.breakfastEndTimeMinute;
        
        let hour = now.hour();
        let minute = now.minute();
        let start = breakfastStartTimeHour * 60 + breakfastStartTimeMinute;
        let end = breakfastEndTimeHour * 60 + breakfastEndTimeMinute;
        let nowMinute = hour * 60 + minute;
//console.log('start:  '+start + ' now:  '+nowMinute  + '  end:  '+end);
        if (start <= nowMinute && nowMinute <= end){
            return true;
        }
        return false;
    }

    //是否为午餐时间
    isLunchTime(addressInfo, now){
         //lunch begining
        let lunchStartTimeHour = addressInfo.lunchStartTimeHour;
        let lunchStartTimeMinute = addressInfo.lunchStartTimeMinute;
        //lunch end
        let lunchEndTimeHour = addressInfo.lunchEndTimeHour;
        let lunchEndTimeMinute = addressInfo.lunchEndTimeMinute;
        let hour = now.hour();
        let minute = now.minute();


        let start = lunchStartTimeHour * 60 + lunchStartTimeMinute;
        let end = lunchEndTimeHour * 60 + lunchEndTimeMinute;
        let nowMinute = hour * 60 + minute;
        //console.log('start:  '+start + ' now:  '+nowMinute  + '  end:  '+end);
        if (start <= nowMinute && nowMinute <= end){
              return true;
        }
        return false;
    }

    //是否为晚餐时间
    isSuperTime(addressInfo, now){
        //supper begining
        let supperStartTimeHour =  addressInfo.supperStartTimeHour;
        let supperStartTimeMinute = addressInfo.supperStartTimeMinute;
        //supper end
        let supperEndTimeHour = addressInfo.supperEndTimeHour;
        let supperEndTimeMinute = addressInfo.supperEndTimeMinute;
        let hour = now.hour();
        let minute = now.minute();
        let start = supperStartTimeHour * 60 + supperStartTimeMinute;
        let end = supperEndTimeHour * 60 + supperEndTimeMinute;
        let nowMinute = hour * 60 + minute;
       // console.log('nowMinute:  '+nowMinute + ' start: '+supperStartTimeHour + '  end:  '+end);
//console.log('start:  '+start + ' now:  '+nowMinute  + '  end:  '+end);
        if (start <= nowMinute && nowMinute <= end){
              return true;
        }
        return false;
    }

    /**
     * 通过用餐地址名称查询某个地址的用餐配置
     * @param {stirng} name 
     */
    async getAddressByName(name){
        if(false === !!name ){
            throw ErrorUtil.makeError("无效的地址名称");
        }
        let address = await DineAddress.findOne({
            where:{
                name:name
            }
        });
        if( address === null || address === undefined){
            throw ErrorUtil.makeError("无此用餐地址");
        }
        return address;
    }
}

function addressCheck(address){
    if(lodash.isEmpty(address)){
        throw ErrorUtil.makeError("无效的地址参数");
    }
    if( lodash.isEmpty(address.name) ){
        throw ErrorUtil.makeError("无效的地点名称");
    }
    if( lodash.isEmpty(address.describe) ){
        throw ErrorUtil.makeError("无效的地点描述");
    }
    checkHour(address.breakfastStartTimeHour);
    checkMinute(address.breakfastStartTimeMinute);
    checkHour(address.breakfastEndTimeHour);
    checkMinute(address.breakfastEndTimeMinute);
    checkHour(address.lunchStartTimeHour);
    checkMinute(address.lunchStartTimeMinute);
    checkHour(address.lunchEndTimeHour);
    checkMinute(address.lunchEndTimeMinute);
    checkHour(address.supperStartTimeHour);
    checkMinute(address.supperStartTimeMinute);
    checkHour(address.supperEndTimeHour);
    checkMinute(address.supperEndTimeMinute);
    let breakfastStartMinutes = address.breakfastStartTimeHour*60+address.breakfastStartTimeMinute;
    let breakfastEndMinutes = address.breakfastEndTimeHour*60+address.breakfastEndTimeMinute;
    if( breakfastStartMinutes >= breakfastEndMinutes ){
        throw ErrorUtil.makeError("不合理的早餐起止时间配置");
    }
    let lunchStartMinutes = address.lunchStartTimeHour*60+address.lunchStartTimeMinute;
    let lunchEndMinutes = address.lunchEndTimeHour*60+address.lunchEndTimeMinute;
    if( lunchStartMinutes >= lunchEndMinutes ){
        throw ErrorUtil.makeError("不合理的午餐起止时间配置");
    }
    let supperStartMinutes = address.supperStartTimeHour*60+address.supperStartTimeMinute;
    let supperEndMinutes = address.supperEndTimeHour*60+address.supperEndTimeMinute;
    if( supperStartMinutes >= supperEndMinutes ){
        throw ErrorUtil.makeError("不合理的晚餐起止时间配置");
    }
    if( breakfastEndMinutes > lunchStartMinutes ){
        throw ErrorUtil.makeError("午餐开始时，早餐应当结束");
    }
    if( lunchEndMinutes > supperStartMinutes ){
        throw ErrorUtil.makeError("晚餐开始时，午餐应当结束");
    }
}

function checkHour(hour){
    if( !lodash.isNumber(hour) || (hour > 23 || hour <0)){
        throw ErrorUtil.makeError("无效的用餐开始小时时间");
    }
}

function checkMinute(minute){
    if( !lodash.isNumber(minute) || (minute > 59 || minute <0)){
        throw ErrorUtil.makeError("无效的用餐结束分钟时间");
    }
}

function updateAddressCheck(){

}

/**
 * 
 * @param {*} bookMealData 
 */
async function checkBookMeal(bookMealData){
    let now = moment();
    bookMealData.declareDate = moment(bookMealData.declareDate);
    bookMealData.declareDate.startOf("date");
    let diffHours = bookMealData.declareDate.diff(now,"hours");
    bookMealData.declareDate = bookMealData.declareDate.toDate();
    if( diffHours < 10 ){
        throw ErrorUtil.makeError("报餐时间已过");
    }
    if( lodash.isEmpty(bookMealData) ){
        throw ErrorUtil.makeError("无效的订餐数据");
    }
    if( !lodash.isInteger(bookMealData.userId) ){
        throw ErrorUtil.makeError("无效的用户id");
    }
    let user = User.findOne({
        where:{id:bookMealData.userId}
    });
    if( user === null ){
        throw ErrorUtil.makeError("无效的用户id");
    }
    if( !lodash.isDate( bookMealData.declareDate ) ){
        throw ErrorUtil.makeError("无效的报餐时间");
    }
    if( bookMealData.breakfast !== 0 && bookMealData.breakfast !== 1 ){
        throw ErrorUtil.makeError("无效的早餐报餐状态");
    }
    if( !lodash.isInteger(bookMealData.breakfastLocationId) ){
        throw ErrorUtil.makeError("无效的早餐用餐地点id");
    }
    let address = DineAddress.findOne({
        where:{id:bookMealData.breakfastLocationId}
    });
    if( address === null ){
        throw ErrorUtil.makeError("无效的早餐用餐地点id");
    }
}

/**
 * @param{[]} templates
 */
function checkDinerTemplate( templates ){
    if( templates.length !== 7 ){
        throw ErrorUtil.makeError("报餐模板应当包含7天的数据");
    }
    templates.forEach( (item,index)=>{
        if( !lodash.isNumber( item.userId) ){
            throw ErrorUtil.makeError("无效的用户id");
        }
        if( item.date !== index + 1 ){
            throw ErrorUtil.makeError("订餐日期异常");
        }
        if( item.breakfast !== 0 &&  item.breakfast !== 1){
            throw ErrorUtil.makeError("无效的早餐订餐状态");
        }
        if( item.lunch !== 0 &&  item.lunch !== 1){
            throw ErrorUtil.makeError("无效的早餐订餐状态");
        }
        if( item.dinner !== 0 &&  item.dinner !== 1){
            throw ErrorUtil.makeError("无效的早餐订餐状态");
        }
        if( !lodash.isNumber(item.breakfastLocationId) ){
            throw ErrorUtil.makeError("无效的早餐用餐地址");
        }
        if( !lodash.isNumber(item.lunchLocationId) ){
            throw ErrorUtil.makeError("无效的早餐用餐地址");
        }
        if( !lodash.isNumber(item.dinnerLocationId) ){
            throw ErrorUtil.makeError("无效的早餐用餐地址");
        }
    });
}

/**
 * 批量报餐中处理一天报餐的方法
 */
async function bulkBookMealOneDay(userId,bookMealData,bookStatus,transaction){
    let declareDate = this.declareDate;
    let promise = new Promise( (resolve,reject)=>{
        let now = moment();
        //过去的日期
        if( declareDate.isBefore(now) ){
            resolve();
            return;
        }
        BookMeal.findOne({
            where:{
                userId:userId,
                declareDate:declareDate.toDate(),
            },
            transaction:transaction
        })
        .then((bookMealRecord)=>{
            if( !bookMealRecord ){
                //添加新报餐记录
                let newRecord = null;
                if( false ===  bookStatus){
                    //忽略的日期,整天都不报餐
                    newRecord = {
                        userId:userId,
                        declareDate:declareDate.toDate(),
                        breakfast:0,
                        breakfastLocationId:bookMealData.breakfastAddress,
                        lunch:0,
                        lunchLocationId:bookMealData.lunchAddress,
                        dinner:0,
                        dinnerLocationId:bookMealData.supperAddress,
                    }
                }else{
                    newRecord = {
                        userId:userId,
                        declareDate:declareDate.toDate(),
                        breakfast:bookMealData.isBreakfast === true ? 1:0,
                        breakfastLocationId:bookMealData.breakfastAddress,
                        lunch:bookMealData.isLunch === true ? 1:0,
                        lunchLocationId:bookMealData.lunchAddress,
                        dinner:bookMealData.isSupper === true ? 1:0,
                        dinnerLocationId:bookMealData.supperAddress,
                    };
                }
                BookMeal.create(newRecord,{
                    transaction:transaction
                })
                .then(function(){
                    return BookMeal.findAll({
                        where:{
                            userId:userId,
                            declareDate:declareDate.toDate(),
                        },
                        transaction:transaction
                    });
                })
                .then(function(results){
                    if( results.length === 1){
                        resolve();
                    }else{
                        throw ErrorUtil.makeError("重复报餐");
                    }
                },function(error){
                    reject(error);
                });
            }else{
                let updateDate = null;
                if( false ===  bookStatus){
                    updateDate = {
                        breakfast:0,
                        breakfastLocationId:bookMealData.breakfastAddress,
                        lunch:0,
                        lunchLocationId:bookMealData.lunchAddress,
                        dinner:0,
                        dinnerLocationId:bookMealData.supperAddress,
                    };
                }else{
                    updateDate = {
                        breakfast:bookMealData.isBreakfast === true ? 1:0,
                        breakfastLocationId:bookMealData.breakfastAddress,
                        lunch:bookMealData.isLunch === true ? 1:0,
                        lunchLocationId:bookMealData.lunchAddress,
                        dinner:bookMealData.isSupper === true ? 1:0,
                        dinnerLocationId:bookMealData.supperAddress,
                    };
                }
                //更新报餐记录
                bookMealRecord.update( updateDate ,{
                    transaction:transaction
                }).then(function(){
                    resolve();
                },function(error){
                    reject(error);
                });
            }    
        });
    });
    return promise;
}
module.exports = new DinerService();