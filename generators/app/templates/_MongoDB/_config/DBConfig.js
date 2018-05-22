module.exports  =  {
    dev:{
        ip:         '127.0.0.1',
        port:       '27017',
        name:       'test'
    },
    product:{
        ip:         '127.0.0.1',
        port:       '27017',
        name:       'test'
    }
}[process.env.NODE_ENV || 'dev'];

