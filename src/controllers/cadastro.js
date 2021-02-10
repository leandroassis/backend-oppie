const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const crypto = require('crypto')
require('dotenv/config')

function encrypt(value){
    const cypher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV);
    if(value){
        var encrypted = cypher.update(value, 'utf-8', process.env.CRYPTO_BASE)
        return encrypted += cypher.final(process.env.CRYPTO_BASE)}
    else{
        return null
    }
}

module.exports = {
    store(req,res){
        mysql.getConnection((err, conn) => {
            //estabelecendo conexão com a db
            if(err){ return res.status(500).json({error:err})}
            conn.query('select * from users where email =  ?', [req.body.email], (error,response)=>{
                //tratando casos de usuários já cadastrados
                if(error){return res.status(500).json({
                    error:error.sqlMessage})}
                if(response.length > 0){
                    res.status(409).json({message: "Ocorreu um erro ao realizar o processo."})
                } else{
                    // adicionando criptografia de dados sensiveis
                    const id = crypto.randomBytes(20).toString("hex")
                    const email = encrypt(req.body.email)
                    const phone = encrypt(req.body.phone)
                    const address = encrypt(req.body.address)
                    const establishment_cnpj = encrypt(req.body.establishment_cnpj)
                    const user_rg = encrypt(req.body.user_rg)
                    const user_cpf = encrypt(req.body.user_cpf)
                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash_password)=>{
                        if(errBcrypt){return res.status(500).json({error:errBcrypt})}
                        conn.query('insert into users (id_user, name,email,password, profile_photo, username, establishment, phone, type_user, address, user_cpf, establishment_cnpj, user_rg) values (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [id, req.body.name, email,hash_password,req.body.profile_photo, req.body.username, req.body.establishment, phone, req.body.type_user, address, user_cpf, establishment_cnpj, user_rg],
                        (error) => {
                        conn.release()
                        if(error){return res.status(500).json({
                            error:error.sqlMessage})}
                        return res.status(201).json({
                            id_user: id,
                            message: "Criado com sucesso"
                        })
                    })})
                }
            })
            
        })
    } 
}