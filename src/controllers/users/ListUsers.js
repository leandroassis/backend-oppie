const mysql = require('../../mysql').pool
const crypto = require('crypto')
const decrypt = require('../functions').decrypt
require('dotenv/config')

module.exports = {
    store(req, res) {
        mysql.getConnection((err, conn) => {
            console.log("OKOK")
            if (err) {
                return res.status(500).json(
                    {
                        error: err
                    }
                )
            }
            conn.query('select * from users', (error, response) => {
                conn.release()
                if (error) {
                    return res.status(500).json({
                        error: error.sqlMessage
                    })
                }
                if (response.length === 0) {
                    res.status(404).json({
                        message: "Não encontrado"
                    })
                }
                return res.status(200).json({
                    message: "Usuários no banco de dados",
                    response
                })
            })
        })
    }
}