let mongoose = require('mongoose');
let dbConfig = require('../config/DBConfig');

let DB_URL = null, timeout = null, db = null;
class DB {

    constructor() {
        DB_URL = 'mongodb://' + dbConfig.ip + ':' + dbConfig.port + '/' + dbConfig.name;
        //_connection();
        //DB_URL = 'mongodb://localhost/test';
    }

    /**
     * you can configulation your connection here.
     */
    init() {
        this._connection();
        db = mongoose.connection;
       // db.set('debug', true)

        /**
         * 连接成功
         */
        db.on('open', function () {
            console.log('Mongoose connection open to ' + DB_URL);
            if (timeout)
                clearInterval(timeout);
        });

        // /**
        //  * 连接异常
        //  */
        db.on('error', function (err) {
            console.log('Mongoose connection error: ' + err);
        });

        // /**
        //  * 连接断开
        //  */
        db.on('disconnected', function () {
            console.log('Mongoose connection disconnected');
            timeout = setTimeout(_db._connection, 60000);//retry connection。
        });
        
    }

    _connection() {
        let conn = mongoose.connect(DB_URL, {useMongoClient: true});
        mongoose.set('debug', true);
        console.log(conn);
    }

    model(entityName, entity){
        return db.model(entityName, entity, entityName);
    }

    create(entity){

    }

}

const _db = new DB();
_db.init();
module.exports = _db;