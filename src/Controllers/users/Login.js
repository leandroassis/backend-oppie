const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mysql = require('../../mysql').pool
const encrypt = require('../functions').encrypt
const decrypt = require('../functions').decrypt
require('dotenv/config')

module.exports = {
    store(req, res) {
        mysql.getConnection((err, conn) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            const email = encrypt(req.body.email)
            conn.query(`select * from ${process.env.TABELA1} where email = ?`, [email], (error, response) => {
                if (error) {
                    return res.status(500).json({
                        error: error.sqlMessage
                    })
                }
                if (response.length < 1) {
                    return res.status(401).json({
                        message: "Falha na autenticação"
                    })
                }
                bcrypt.compare(req.body.password, response[0].password, (errBcrypt, results) => {
                    if (errBcrypt) {
                        return res.status(401).json({
                            message: "Falha na autenticação"
                        })
                    }

                    if (results) {
                        if (!response[0].confirmed) {
                            return res.status(401).json({
                                message: "Email não confirmado."
                            })
                        }

                        const token = jwt.sign(
                            {
                                id_usuario: response[0].id_user
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: "25d"
                            })

                        conn.query(`update ${process.env.TABELA1} set token = ? where id_user = ?`, [token, response[0].id_user], (err, sucess) => {
                            
                            conn.release()

                            if (err) {
                                return res.status(500).json({
                                    error: err.sqlMessage
                                }
                                )
                            }
                            return res.status(200).send({
                                message: "Logado com sucesso",
                                token: token
                            })
                        })
                    }
                    else {
                        return res.status(401).json({ message: "Falha na autenticação" })
                    }
                })
            })
        })
    }
}