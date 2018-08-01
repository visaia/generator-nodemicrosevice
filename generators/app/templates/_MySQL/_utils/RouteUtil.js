var fsUtil = require('./FSUtil');
var fs = require('fs');
var path = require('path');
var router = require('koa-router')({ prefix: '/api' });

class RouteUtil{
//initial route dynamically.
    initRoute(){
        var api = path.join(__dirname, '../api');
        return fsUtil.readdir(api).then((dirs)=>{
            for(let dir of dirs){
                if (fs.lstatSync(api+'/'+dir).isDirectory()){
                    let router0 = require('../api/'+dir+'/route');
                    router.use(router0.routes(), router0.allowedMethods());
                }
            }
            return router.routes();
        }); 
    }
}



module.exports = new RouteUtil();
