const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const crypto = require('crypto')
require('dotenv/config')

function encrypt(value){
    var cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, Buffer.from(process.env.CRYPTO_PASSWORD, 'hex'), Buffer.from(process.env.CRYPTO_IV, 'hex'))
    let encrypted = cipher.update(value, 'utf-8', 'hex')
    encrypted += cipher.final('hex')
    console.log(encrypted)
    return encrypted
}

module.exports = {
    store(req,res){
        console.log(encrypt("16579923733"))
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
                    const id = crypto.randomBytes(20).toString("hex")
                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash_password)=>{
                        if(errBcrypt){return res.status(500).json({error:errBcrypt})}
                        conn.query('insert into users (id_user, name,email,password, profile_photo, username, establishment, phone, type_user, address, user_cpf, establishment_cnpj, user_rg, social_media, relevant_categories) values (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [id, req.body.name,req.body.email,hash_password,req.body.profile_photo, req.body.username, req.body.establishment, req.body.phone, req.body.type_user, req.body.address, req.body.user_cpf, req.body.establishment_cnpj, req.body.user_rg, req.body.social_media, req.body.categories],
                        (error) => {
                        conn.release()
                        if(error){return res.status(500).json({
                            error:error.sqlMessage})}
                        return res.status(201).json({
                            message: "Criado com sucesso"
                        })
                    })})
                }
            })
            
        })
    } 
}