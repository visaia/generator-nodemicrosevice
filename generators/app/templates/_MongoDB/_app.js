const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const serve = require('koa-static');
const onerror = require('koa-onerror');
//const bodyparser = require('koa-bodyparser')();
const body = require('koa-better-body');
const cors = require('koa2-cors');
const router = require('koa-router')({ prefix: '/api' });
const logUtil = require('./utils/LogUtil');

let routeUtil;
if (process.env.NODE_ENV !== 'production') {
    routeUtil = require('./utils/RouteUtil');
} else {
    //webpacek压缩打包时，添加需要加载的路由，例如：
    // energy = require('./api/energy/route');
}

// error handler
onerror(app);
app.use(cors({
  credentials:true
}));
//configSession(app);
// middlewares
//app.use(bodyparser);

app.use(body());
//app.use(json());

app.use(serve(__dirname + '/public'));



//app.use(logger());
//app.use(require('koa-static')(__dirname + '/public'));

// app.use(views(__dirname + '/views', {
//   extension: 'html'
// }));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  try {
    await next();
    let ms = new Date() - start;
    logUtil.logResponse(ctx, ms);
  } catch(e){
    let ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, e, ms);
  }
});

//session check
// app.use(async(ctx, next)=>{
//   try{
//     //SessionAuth.check(ctx);
//     await next();
//   } catch(e){
//     logUtil.logError(ctx, 'Error tocket!', ms);
//   }
// });

//route
if (process.env.NODE_ENV === 'production') {
    //webpacek压缩打包时，添加需要加载的路由，例如：
    // router.use(energy.routes(), energy.allowedMethods());
    // app.use(router.routes());
} else {
    routeUtil.initRoute().then((routes) => {
        app.use(routes);
    });
}


module.exports = app;
