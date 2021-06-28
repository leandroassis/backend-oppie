const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')


const mysql = require('../../mysql').pool
const confirmEmail = require('../functions').confirmEmail
const encrypt = require('../functions').encrypt
require('dotenv/config')

module.exports = {
    store(req, res) {
        mysql.getConnection((err, conn) => {
            //estabelecendo conexão com a db
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }

            conn.query(`select * from ${process.env.TABELA1} where email =  ?`, [req.body.email], (error, response) => {
                //tratando casos de usuários já cadastrados
                if (error) {
                    return res.status(500).json({
                        error: error.sqlMessage
                    })
                }
                if (response.length > 0) {
                    res.status(409).json({
                        message: "Ocorreu um erro ao realizar o processo."
                    })
                } else {
                    // adicionando criptografia de dados sensiveis e criando token
                    var date = new Date()
                    const id = crypto.randomBytes(18).toString("hex")
                    const email = encrypt(req.body.email)
                    const phone = encrypt(req.body.phone)
                    const address = encrypt(req.body.address)
                    const birthday = req.body.birthday
                    const establishment_cnpj = encrypt(req.body.establishment_cnpj)
                    const user_rg = encrypt(req.body.user_rg)
                    const user_cpf = encrypt(req.body.user_cpf)
                    const token = jwt.sign(
                        {
                            id_usuario: id
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "45d"
                        })

                    var day = date.getDate()
                    var month = date.getMonth() + 1
                    var year = date.getFullYear()
                    var creationDate = year + '/' + month + '/' + day

                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash_password) => {
                        if (errBcrypt) {
                            return res.status(500).json({
                                error: errBcrypt
                            })
                        }
                        // inserção dos dados com as criptografias no banco de dados
                        conn.query(`insert into ${process.env.TABELA1} (id_user, name,email,password, profile_photo, username, establishment, phone, type_user, address, user_cpf, establishment_cnpj, user_rg, token, createdAt, updatedAt, birthday) values (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [id, req.body.name, email, hash_password, req.body.profile_photo, req.body.username, req.body.establishment, phone, req.body.type_user, address, user_cpf, establishment_cnpj, user_rg, token, creationDate, creationDate, birthday],
                            (error) => {
                                conn.release()
                                if (error) {
                                    return res.status(500).json({
                                        error: error.sqlMessage
                                    })
                                }
                                confirmEmail(req.body.email, token)
                                // enviando email de verificação após o cadastro ter sido realizado
                                return res.status(201).json({
                                    id_user: id,
                                    message: "Criado com sucesso"
                                })
                            })
                    })
                }
            })

        })
    }
}