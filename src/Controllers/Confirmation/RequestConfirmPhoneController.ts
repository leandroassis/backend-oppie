const mysql = require('../../mysql').pool

const confirmPhone = require('../functions').confirmPhone

module.exports = {
    store(req, res) {
        let code = confirmPhone(req.body.phone)

        mysql.getConnection((err, conn) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }

            conn.query(`inset into ${process.env.TABELA1} phone_confirmed values ? where id_user=?`, [code, req.body.id], (error) => {
                conn.release()
                
                if (error) {
                    return res.status(500).json({
                        error: error.sqlMessage
                    })
                }
                return res.status(202).json({
                    message: "Código Enviado"
                })
            })
        })
    }
}