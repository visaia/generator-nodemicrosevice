class RSUtil{
    ok(v, desc){
        return {ok: 1, value: v, desc:desc||'sucess for operation'};
    }

    fail(desc){
        return {ok: 0,  desc:desc||'fail for operation'};
    }
}

module.exports = new RSUtil();