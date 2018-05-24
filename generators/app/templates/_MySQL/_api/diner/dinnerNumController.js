'use strict';
const rsUtil = require('../../utils/RSUtil');
const errorUtil = require('../../utils/ErrorUtil');
const dinnerNumService = require('./dinnerNumService');
const lodash = require('lodash');
const moment = require('moment');

class dinnerNumController {

    async bookedSomeDay(ctx){
        try {
            let params = ctx.request.fields;
            let time = params.time;//开始日期,返回包括开始日期内的该地址未来dayNum天的订餐人数,不超过20
            checkIsDate(time);
            let dayNum = params.dayNum;//数字
            checkNum(dayNum);
            dayNum = dayNum > 20 ? 20 : dayNum;
            // let meal = params.meal;//哪一顿{0:早餐,1:午餐,2:晚餐}
            // checkMeal(meal);
            let addr = params.addr;//就餐地点{1:策维,2:艾励美特}
            checkAddr(addr);
            let result = await dinnerNumService.bookedSomeDay({
                'time': time,
                'dayNum': dayNum,
                'addr': addr
            });
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取订餐人数失败");
        }
    }

    async bookedThisDay(ctx){
        try {
            let params = ctx.request.fields;
            let meal = params.meal;//哪一顿{0:早餐,1:午餐,2:晚餐}
            checkMeal(meal);
            let addr = params.addr;//就餐地点{1:策维,2:艾励美特}
            checkAddr(addr);
            let result = await dinnerNumService.bookedThisDay({
                'meal': meal,
                'addr': addr
            });
            let time = params.time;//日期
            let timeResult = checkTime(time, meal);
            if (timeResult.ok !== 1) {
                ctx.body = rsUtil.ok(result, timeResult);
            }
            else {
                ctx.body = rsUtil.ok(result);
            }
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取订餐人数失败");
        }
    }

    async bookedUneatedThisDay(ctx){
        try {
            let params = ctx.request.fields;
            let meal = params.meal;//哪一顿{0:早餐,1:午餐,2:晚餐}
            checkMeal(meal);
            let addr = params.addr;//就餐地点{1:策维,2:艾励美特}
            checkAddr(addr);
            let result = await dinnerNumService.bookedUneatedThisDay({
                'meal': meal,
                'addr': addr
            });
            let time = params.time;//日期
            let timeResult = checkTime(time, meal);
            if (timeResult.ok !== 1) {
                ctx.body = rsUtil.ok(result, timeResult);
            }
            else {
                ctx.body = rsUtil.ok(result);
            }
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取未吃人数失败");
        }
    }

    async eatedThisDay(ctx){
        try {
            let params = ctx.request.fields;
            let meal = params.meal;//哪一顿{0:早餐,1:午餐,2:晚餐}
            checkMeal(meal);
            let addr = params.addr;//就餐地点{1:策维,2:艾励美特}
            checkAddr(addr);
            let result = await dinnerNumService.eatedThisDay({
                'meal': meal,
                'addr': addr
            });
            let time = params.time;//日期
            let timeResult = checkTime(time, meal);
            if (timeResult.ok !== 1) {
                ctx.body = rsUtil.ok(result, timeResult);
            }
            else {
                ctx.body = rsUtil.ok(result);
            }
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取已吃人数失败");
        }
    }

    async bookList(ctx){
        let bookListArr = [
            {
                id: 1,
                name: "node.js",
                authorId: "use1",
                publishDate: "2018-05-10"
            },
            {
                id: 2,
                name: "JAVA",
                authorId: "use2",
                publishDate: "2018-05-10"
            },
            {
                id: 3,
                name: "C++",
                authorId: "use3",
                publishDate: "2018-05-10"
            },
            {
                id: 4,
                name: "React",
                authorId: "use4",
                publishDate: "2018-05-10"
            }
        ];
        ctx.body = {code:200,data:bookListArr};
    }

}

    function checkMeal(meal) {
        if (meal !== 0 && meal !== 1 && meal !== 2) {
            throw errorUtil.makeError("无效的早餐/午餐/晚餐参数");
        }
    }

    function checkAddr(addr) {
        if (addr !== 1 && addr !== 2) {
            throw errorUtil.makeError("无效的用餐地点参数");
        }
    }

    function checkNum(num) {
        if (!lodash.isNumber(num)) {
            throw errorUtil.makeError("无效的用餐天数参数");
        }
    }

    function checkTime(time, meal) {
        //1:ok,0:未到就餐时间:,-1:超过就餐时间,-2:服务器时间不匹配,-3:未知错误
        if (!moment().startOf("date").isSame(moment(time).startOf("date"))) {
            return {
                ok: -2,
                desc: '服务器时间不匹配'
            }
        }
        switch (meal) {
            case 0:
                
            break;
            case 1:

            break;
            case 2:

            break;
            default:
                return {ok:-3, desc: '未知错误'};
        }
        return {ok: 1};
    }

    function checkIsDate(time) {
        if (!lodash.isDate(new Date(time))) {
            throw errorUtil.makeError("无效的用餐日期参数");
        }
    }

module.exports = new dinnerNumController();