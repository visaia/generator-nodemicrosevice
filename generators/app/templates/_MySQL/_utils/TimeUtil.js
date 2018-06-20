const moment = require('moment');
class TimeUtil{

    getDayStartUnixTime(){
        let now = moment().hour(0).minute(0).second(0);
        let curstartTime = now.format('X');
        return curstartTime;
    }

    geCurUnixTime(){
        let curstartTime = moment().format('X');
        return curstartTime;
    }

    //day: yyyy-MM-dd HH:mm:ss, return 10位的long
    toLong(day){
        return moment(day).format('X');
    }

    //day: string对象， duration为加多少天
    addDay(day, duration){
        return moment(day).add(duration, 'd').format('X');
    }

}

module.exports = new TimeUtil();
