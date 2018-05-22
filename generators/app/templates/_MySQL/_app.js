const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const onerror = require('koa-onerror');
const body = require('koa-better-body');
const cors = require('koa2-cors');

const logUtil = require('./utils/LogUtil');
const routeUtil = require('./utils/RouteUtil');

// error handler
onerror(app);
app.use(cors({
  credentials:true
}));

app.use(body());

app.use(serve(__dirname + '/public'));

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

//route
routeUtil.initRoute().then((routes) => {
  app.use(routes);
});


module.exports = app;
