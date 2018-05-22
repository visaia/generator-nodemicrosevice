let demo = {
    devID : { type: Number }, // 后续改为String类型存储
    director: {type: String},
    devName: {type: String},
    ip: {type: String},
    port: {type: Number},
    desc: {type: String},
    site: {type: String},
    flagSn: {type: Number},
    updateDate: {type: Date, default: Date.now}
};
demo.getTableName = ()=>{
    return 'demo';
}
module.exports = demo;
