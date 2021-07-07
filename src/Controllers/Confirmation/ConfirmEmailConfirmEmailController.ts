const mysql = require('../../mysql').pool
require('dotenv/config')


module.exports = {
    store(req, res) {
        mysql.getConnection((err, conn) => {

            if (err) {
                return res.status(500).json({
                    error: err
                })
            }


            conn.query(`SELECT * FROM ${process.env.TABELA1} WHERE token = ?`, [req.query.token] , (error, responseQuery) => {
                if (error) {
                    return res.status(500).json({
                        error: error.sqlMessage
                    })
                }
                if (JSON.parse(JSON.stringify(responseQuery))[0] != undefined) {
                    conn.query(`update ${process.env.TABELA1} set confirmed = ? where token = ?`, [true, req.query.token], (error, response) => {

                        conn.release()
                        if (error) {
                            return res.status(500).json({
                                error: error.sqlMessage
                            })
                        }

                        return res.status(200).json({
                            message: "Confirmado com sucesso",
                            token: req.query.token
                        })
                    })
                }
                else {
                    return res.status(400).json({
                        message: "O tokem é inválido",
                        token: req.query.token
                    })
                }
            })
        })
    }
}