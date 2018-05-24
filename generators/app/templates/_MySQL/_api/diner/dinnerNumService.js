'use strict';
const Sequelize = require('Sequelize');
const store = require('../../config/db').store;
// const BookMeal = require('../../models/BookMeal.js');
const DineTemplate = require('../../models/DineTemplate.js');
const ErrorUtil =  require("../../utils/ErrorUtil");
const BasicService = require('../../services/BasicService');<% if(includeWebsocket) { %>
const WSBasicService = require('../../services/WSBasicService');<% } %>
const lodash = require('lodash');
const moment = require('moment');
class DinerService extends BasicService{

    // async bookedSomeDay(params) {
    //     let startDay = moment(params.time).startOf("date");
    //     let bookedPromises = [];
    //     try {
    //         for (let i = 0; i < params.dayNum; i++) {
    //             bookedPromises.push( BookMeal.count({
    //                 where: {
    //                     declareDate: startDay.toDate(),
    //                     breakfast: 1,//1:已报餐
    //                     breakfastLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             }));
    //             bookedPromises.push( BookMeal.count({
    //                 where: {
    //                     declareDate: startDay.toDate(),
    //                     lunch: 1,//1:已报餐
    //                     lunchLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             }));
    //             bookedPromises.push( BookMeal.count({
    //                 where: {
    //                     declareDate: startDay.toDate(),
    //                     dinner: 1,//1:已报餐
    //                     dinnerLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             }));
    //             startDay = startDay.add(1,"day");
    //         }
    //         let bookedResult = await Promise.all(bookedPromises);
    //         let returnResult = [];
    //         for (let j = 0; j < bookedResult.length; ) {
    //             returnResult.push({
    //                 'breakfast': bookedResult[j++],
    //                 'lunch': bookedResult[j++],
    //                 'dinner': bookedResult[j++]
    //             })
    //         }
    //         return returnResult;
    //     }
    //     catch (err) {
    //         return err;
    //     }
    // }
    //
    // async bookedThisDay(params) {
    //     let today = moment().startOf("date");
    //     try {
    //         let countNum;
    //         switch(params.meal) {
    //             case 0:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     breakfast: 1,//1:已报餐
    //                     breakfastLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             case 1:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     lunch: 1,//1:已报餐
    //                     lunchLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             case 2:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     dinner: 1,//1:已报餐
    //                     dinnerLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             default:
    //             countNum = null;
    //             break;
    //         }
    //         return countNum;
    //     }
    //     catch (err) {
    //         return err;
    //     }
    // }
    //
    // async bookedUneatedThisDay(params) {
    //     let today = moment().startOf("date");
    //     try {
    //         let countNum;
    //         switch(params.meal) {
    //             case 0:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     breakfast: 1,//1:已报餐,
    //                     breakfastStatus: 0,//0:未用餐
    //                     breakfastLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             case 1:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     lunch: 1,//1:已报餐
    //                     lunchStatus: 0,//0:未用餐
    //                     lunchLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             case 2:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     dinner: 1,//1:已报餐
    //                     dinnerStatus: 0,//0:未用餐
    //                     dinnerLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             default:
    //             countNum = null;
    //             break;
    //         }
    //         return countNum;
    //     }
    //     catch (err) {
    //         return err;
    //     }
    //
    // }
    //
    // async eatedThisDay(params) {
    //     let today = moment().startOf("date");
    //     try {
    //         let countNum;
    //         switch(params.meal) {
    //             case 0:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     breakfastStatus: 1,//1:已用餐
    //                     breakfastLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             case 1:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     lunchStatus: 1,//1:已用餐
    //                     lunchLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             case 2:
    //             countNum = await BookMeal.count({
    //                 where: {
    //                     declareDate: today,
    //                     dinnerStatus: 1,//1:已用餐
    //                     dinnerLocationId: params.addr,
    //                     isDelete: 0
    //                 }
    //             });
    //             break;
    //             default:
    //             countNum = null;
    //             break;
    //         }
    //         return countNum;
    //     }
    //     catch (err) {
    //         return err;
    //     }
    //
    // }
}
module.exports = new DinerService();