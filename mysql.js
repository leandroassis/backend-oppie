const mysql = require('mysql');

const pool = mysql.createPool({ //cria pool de conexoes
    // adicionar variaveis de env
    "user": "admin",
    "password":"#030102Le",
    "database":"oppie", //nome do banco de dados dentro do host
    "host": "db-oppie-test1.csoqetuxgd3d.us-east-2.rds.amazonaws.com",
    "port": 3306
})

exports.pool = pool;