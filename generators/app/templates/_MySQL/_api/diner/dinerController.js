'use strict';
const rsUtil = require('../../utils/RSUtil');
const errorUtil = require('../../utils/ErrorUtil');
const dinerService = require('./dinerService');
const lodash = require('lodash');


class DinerController{

    async getDinerAddress(ctx){
        try {
            let result = await dinerService.findAll();
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取用餐地址失败");
        }
    }
    async addDinerAddress(ctx){
        try {
            let address = ctx.request.fields;
            let result = await dinerService.addDineAddress(address);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"添加用餐地址失败");
        }
    }

    async updateDinerAddress(ctx){
        try {
            let address = ctx.request.fields;
            let result = await dinerService.updateDineAddress(address);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"更新用餐地址失败");
        }
    }

    async removeDinerAddress(ctx){
        
    }



    /**
     * judge the time is meal time or not.
     * return: false||true
     */
    async judgeMealTime(ctx){
        let params = ctx.params;
        let location = params.location;
        if(lodash.isEmpty(location)){
             ctx.body = rsUtil.fail('没有定义就餐数据');
             return;
        }
        try{
           let rs = await dinerService.judgeMealTime(location);
           ctx.body = rsUtil.ok(rs);
        } catch(error){
            errorUtil.responseError(ctx, error, '判断是否就餐数据出错');
        }
    }

    async getBookMealRecord(ctx){
        try {
            let params = ctx.request.fields;
            let result = await dinerService.getBookMealRecord(params);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取报餐记录失败");
        }
    }

    async bookMeal(ctx){
        try {
            let bookMealData = ctx.request.fields;
            let result = await dinerService.bookMeal(bookMealData);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"报餐失败");
        }
    }

    async getDineTemplate(ctx){
        try {
            let userId = ctx.request.fields.userId;
            let result = await dinerService.getDineTemplate(userId);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取订餐模板异常");
        }
    }

    async updateDineTemplate(ctx){
        try {
            let templates = ctx.request.fields;
            let result = await dinerService.updateDineTemplate(templates);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"更新订单模板异常");
        }
    }

    async getUserListWidthBookMealRecord(ctx){
        try {
            let queryParams = ctx.request.fields;
            let result = await dinerService.updateDineTemplate(templates);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"更新订单模板异常");
        }
    }

    async bulkBookMeal(ctx){
        try {
            let params = ctx.request.fields;
            let result = await dinerService.bulkBookMeal(params);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"批量报餐成功");
        }
    }

    async getBookMealRecordList(ctx){
        try {
            let params = ctx.request.fields;
            let result = await dinerService.getBookMealRecordList(params);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取用户报餐信息失败");
        }
    }

    async getTodayBookMealRecord(ctx){
        try {
            let result = await dinerService.getTodayBookMealRecord();
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取当天用户报餐数据失败");
        }
    }

    async getAddressByName(ctx){
        try {
            let name = ctx.request.fields.name;
            let result = await dinerService.getAddressByName(name);
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"获取指定报餐配置信息失败");
        }
    }
}
module.exports = new DinerController();