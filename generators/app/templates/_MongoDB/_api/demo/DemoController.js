let demoService = require('./DemoService');
let demoFlagSnService = require('./DemoFlagSnService');
let RSUtil = require('../../utils/RSUtil');
class DemoController{
    async create(ctx){
        let params = ctx.request.fields;
        let rs = await demoService.create(params);
        ctx.body = RSUtil.ok(rs);
    }

    async update(ctx){
        let params = ctx.request.fields;
        let rs = await demoService.update(params);
        ctx.body = RSUtil.ok(rs);
    }

    async delete(ctx){
        let params = ctx.params;
        let pageIndex = params.pageIndex;
        let id = params.id;
        let rs = await demoService.removeById(id);
        rs = await demoService.pageByCondition(null, pageIndex);
        ctx.body = RSUtil.ok(rs);
    }

    async list(ctx){
        let params = ctx.params;
        let pageIndex = params.pageIndex;
        let rs = await demoService.pageByCondition(null, pageIndex);
        ctx.body = RSUtil.ok(rs);
    }

    async findFlagSn(ctx){
        let params = ctx.params;
        let rs = await demoFlagSnService.findAll(params);
        ctx.body = RSUtil.ok(rs);
    }

    async createFlagSn(ctx){
        let params = ctx.request.fields;
        let rs = await demoFlagSnService.create(params);
        ctx.body = RSUtil.ok(rs);
    }

    async updateLatestSn(ctx){
        let params = ctx.request.fields;
        let rs = await demoFlagSnService.updateOrCreate({title:"记录SN"},{$set:{flagSn:params.flagSn}},{upsert:false});
        ctx.body = RSUtil.ok(rs);
    }

}

module.exports = new DemoController();
