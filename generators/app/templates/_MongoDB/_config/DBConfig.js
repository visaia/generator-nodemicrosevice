module.exports  =  {
    development:{
        ip:         '127.0.0.1',
        port:       '27017',
        name:       'test'
    },
    production:{
        ip:         '127.0.0.1',
        port:       '27017',
        name:       'test'
    }
}[process.env.NODE_ENV || 'development'];

