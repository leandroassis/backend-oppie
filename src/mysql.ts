const mysql = require('mysql');
require('./Controllers/Users/node_modules/dotenv/config')

const pool = mysql.createPool({ //cria pool de conexoes
    // adicionar variaveis de env
    "user": process.env.USER_SQL,
    "password":process.env.PASSWORD_SQL,
    "database":process.env.DATABASE, //nome do banco de dados dentro do host
    "host": process.env.HOST_CLOUD,
    "port": process.env.CONNECTION_PORT
})

exports.pool = pool;