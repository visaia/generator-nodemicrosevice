var fs = require('fs');
const path = require("path");
const fsExtra = require("fs-extra");
const uuidV4 = require('uuid/v4');
const Jimp = require("jimp");
const rp = require('request-promise');
//const fileServer = "http://localhost:3003/";
const fileServer = require('../config/url.js').fileServer;
const iconv = require('iconv-lite');
var readDir = function (path){
  return new Promise(function (resolve, reject){
    fs.readdir(path, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
};

/**
 * 将(上传)的文件复制到public/uploadFiles目录下
 * uuid一个新的文件夹，文件使用原始名称存放
 * @param {*} files 
 */
let copyUploadFile = async function(files){
    let root = getProjectDir();
    let promiseArray = [];
    let dir = path.join(root,"public/uploadFiles/");
    if( files.length === 0 ){
        return new Promise((resolve,reject)=>{
            resolve();
        });
    }
    try {
        await ensureDir(dir);
    } catch (error) {
        return new Promise((resolve,reject)=>{
            reject(error);
        });
    }
    files.forEach( (file)=>{
        let p =  new Promise((resolve,reject)=>{
            let id = uuidV4();
            let src = file.path;
            let dest = path.join(dir,id,file.name);
            fsExtra.copy(src, dest, err => {
                if (err){
                    reject(err);
                }else{
                    resolve(path.join("uploadFiles/",id,file.name));
                }
            });
        });
        promiseArray.push(p);
    });
    return Promise.all(promiseArray);
}

/**
 *获取当前应用所在目录
 */
function getProjectDir(){
    let dir = __dirname;
    dir = dir.replace(/\\\\/g,"/");
    dir = dir.replace("utils","");
    return dir;
}

/**
 * 将指定文件重新resize到public/imgs目录下
 * @param {string} imgPath 
 * @param {*} config 
 */
async function resizeImg(imgPath,config){
    let id = uuidV4();
    let fileName = parseFileName(imgPath);
    let rootDir = getProjectDir();
    imgPath = path.join(rootDir,"public",imgPath);
    let dir = path.join(rootDir,"public/imgs");
    let dest = path.join(dir,id,fileName);
    try {
        await ensureDir(dir);
        await ensureDir(path.join(dir,id));
    } catch (error) {
        return new Promise((resolve,reject)=>{
            reject(error);
        });
    }

    let width = config.width || 128;
    let height = config.height || 85;
    return new Promise( (resolve,reject)=>{
        let lenna = null;
        Jimp.read(imgPath)
        .then( (lenna)=>{
            lenna.resize(width, height)   // resize 
            .quality(100)  // set JPEG quality
            .write(dest); // save 
            resolve( path.join("imgs",id,fileName) );
        })
        .catch( (error)=>{
            reject(error);
        });
    });
}

/**
 * 确保指定目录存在
 * @param {string} dir 
 */
function ensureDir(dir){
    return new Promise(( resolve,reject)=>{
        fsExtra.ensureDir(dir, err => {
              if (err){
                  reject(err);
              }else{
                  resolve();
              }
          })
    });
}

/**
 * 从文件路径中解析出文件名
 * @param {string} path 
 */
function parseFileName(path){
    var index = path.lastIndexOf("\\");
    return path.substr(index);
}
class FSUtil{

    async readdir(path){
        return await readDir(path);
    }
    async copyUploadFile(files){
        return await copyUploadFile(files);
    }
    async resizeImg(imgPath,config){
        return await resizeImg(imgPath,config);
    }
    /**
     * 生成一个CSV格式的文件内容
     * @param {[{}]} header 
     * @param {[{}]} data 
     */
    makeCSVFile(header,data,paper){
        let content ="";
        header.forEach((item)=>{
            content += item.label+",";
        });
        content+="\r\n";
        data.forEach((item,index)=>{
            let cell = null;
            header.forEach( (head)=>{
                if( item[head.key] === undefined || item[head.key] === null ){
                    cell =  "";
                }else{
                    cell = item[head.key];
                }
                content += cell+",";
            });
            content += "\r\n";
        });
        let contents={conttent:content,paperinfo:paper}
        return contents;
    }

    uploadFile(data,url){
        let paperinfo=data.paperinfo;
        data=data.conttent;
        url = url || fileServer+"upload/file";
        let options = {
            method: 'POST',
            url: url
        };
        let buf = iconv.encode(data, 'GBK');
        options.formData = {
            file:{
                value: buf,
                options: {
                    filename:paperinfo+'report.CSV',
                    contentType: 'application/vnd.ms-excel'
                }
            }
        };
        return new Promise( (resolve,reject)=>{
            rp(options)
            .then( (result)=>{
                resolve(result);
            })
            .catch( (error)=>{
                reject(error);
            });
        });
    } 
    uploadImg(data,directory,url){
        url = url || fileServer+"upload/createmoreImg";
        let options = {
            method: 'POST',
            url: url,
            json:true
        };
        options.formData = {
            name:"userface",
            directory: directory,
        };
        for( let i= 0 ;i<data.length;i++ ){
            options.formData["file"+i]={};
            options.formData["file"+i].options ={};
            options.formData["file"+i].value = fs.createReadStream(data[i].path);
            options.formData["file"+i].options.filename = data[i].name;
            options.formData["file"+i].options.ContentType ='image/jpg';
        }
        return new Promise( (resolve,reject)=>{
            rp(options)
            .then( (result)=>{
                resolve(result);
            })
            .catch( (error)=>{
                reject(error);
            });
        });
    }
}

module.exports = new FSUtil(); 
