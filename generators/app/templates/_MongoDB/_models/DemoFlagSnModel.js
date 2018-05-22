let demoFlagSn = {
  flagSn: {type: Number},
  title: {type: String},
  updateDate: {type: Date, default: Date.now}
};
demoFlagSn.getTableName = ()=>{
  return 'demo_Flag_Sn';
};
module.exports = demoFlagSn;
