let fsUtil = require("./utils/FSUtil");
let fs = require("fs");
let path = require("path");



let init = function() {
    let models = path.join(__dirname, "./models");
    fsUtil.readdir(models).then(files => {
        // console.log(files);
        for(let file of files) {
            if ('Models.js' == file){//filter Models
                continue;
            }
            let modelname = file.replace(/\.js$/g,"");
            let dirname = modelname.replace(/\_/g,"").toLocaleLowerCase();
            let api = path.join(__dirname, "./api", dirname);
            // console.log(api);
            let filename = modelname;
            filename.replace(/\_\w/g, function (match,index,string) {
                filename = filename.slice(0,index) + match.toLocaleUpperCase() + filename.slice(index + 2);
            });
            filename = filename.replace(/\_/g,"");
            filename = filename.slice(0,1).toLocaleUpperCase() + filename.slice(1);

            if(!fs.existsSync(api)) {
                fs.mkdirSync(api);//生成文件夹
                createService(api,file, filename, modelname);//生成service文件
                createController(api, filename);//生成service文件
                createRoute(api, dirname, filename);//生成service文件
                console.log(`目录：${api}，已经成功生成`)
            }else {
                console.log(`该目录：${api}，已经存在`)
            }
        }
    });

};

//生成service文件
function createService(api, file, filename, modelname) {

    let tempService = `const BasicService = require('../../services/BasicService');
const Sequelize = require('Sequelize');
const db = require('../../config/db');
const store = db.getStore();
const ${modelname} = require('../../models/${modelname}')(store, Sequelize);
class ${filename}Service extends BasicService{
  constructor(){
    super('${modelname}');
  }
}
module.exports = new ${filename}Service();`;

    let tempservicefile = path.join(api,filename);
    fs.writeFile(`${tempservicefile}Service.js`, tempService, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');});
}

//生成controller文件
function createController(api, filename) {
    let tempController = `const ${filename}Service = require('./${filename}Service');
const RSUtil = require('../../utils/RSUtil');
const LogUtil = require('../../utils/LogUtil');
let TimeUtil = require('../../utils/TimeUtil');

class ${filename}Controller {
    async create(ctx){
        try {
            let params = ctx.request.fields;
            let result = await ${filename}Service.create(params);
            ctx.body = RSUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"添加失败");
        }
    }
    
    async delete(ctx){
        try {
            let id = ctx.params.id;
            let result = await ${filename}Service.destroy(id);
            ctx.body = RSUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"删除失败");
        }
    }
    
    async update(ctx){
        try {
            let params = ctx.request.fields;
            let result = await ${filename}Service.update(params);
            ctx.body = RSUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"更新失败");
        }
    }
    
    async findById(ctx){
        try {
            let id = ctx.params.id;
            let result = await ${filename}Service.findById(id);
            ctx.body = RSUtil.ok(result);
        } catch (error) {
            errorUtil.responseError(ctx,error,"查找失败");
        }
    }
    
}

module.exports = new ${filename}Controller();`;

    let tempcontrollerfile = path.join(api,filename);
    fs.writeFile(`${tempcontrollerfile}Controller.js`, tempController, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');});
}

//生成route文件
function createRoute(api, dirname, filename) {
    let temproute = `var router = require('koa-router')();
var ${filename}Controller = require('./${filename}Controller');

router.post('/${dirname}/create', ${filename}Controller.create);
router.get('/${dirname}/delete/:id', ${filename}Controller.delete);
router.post('/${dirname}/update', ${filename}Controller.update);
router.get('/${dirname}/findById/:id', ${filename}Controller.findById);

module.exports = router;`;

    let temproutefile = path.join(api,"route");
    fs.writeFile(`${temproutefile}.js`, temproute, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');});
}

init();