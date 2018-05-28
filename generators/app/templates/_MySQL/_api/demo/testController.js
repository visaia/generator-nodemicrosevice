'use strict';
const rsUtil = require('../../utils/RSUtil');
const errorUtil = require('../../utils/ErrorUtil');
const testService = require('./testService');
const lodash = require('lodash');
const moment = require('moment');

class testController {

    async testCreate(ctx){
        try {
            let params = ctx.request.fields;
            let result = await testService.create({
                'id': params.id,
                'test': params.test
            });
            ctx.body = rsUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"添加失败");
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

module.exports = new testController();