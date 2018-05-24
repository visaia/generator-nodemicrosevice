let demoService = require('./DemoService');
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

module.exports = new DemoController();
