class RSUtil{
    ok(v, desc){
        return {ok: 1, value: v, desc:desc||'sucess for operation'};
    }

    fail(desc){
        return {ok: 0,  desc:desc||'fail for operation'};
    }
    orderFail(code,desc){
        //code = -1000 无法给前端展示的异常信息,认定为系统异常
        /**
         * code:-1001 余额不足
         * code:-1002 产品价格已经发生变动
         * code:-1003 产品库存不足
         * code:-1004 产品已经下架
         */
        return {ok: 0,  desc:{
            code:code,
            desc:desc
        }};
    }
}

module.exports = new RSUtil();