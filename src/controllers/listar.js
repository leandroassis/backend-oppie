const mysql = require('../mysql').pool
const crypto = require('crypto')
require('dotenv/config')

function decrypt(value){
    const decypher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV)
    decypher.update(value, 'base64', 'utf-8')
    decrypted = decypher.final()
    return decrypted
}


module.exports = {
    store(req, res){
        mysql.getConnection((err, conn) => {
            if(err){ return res.status(500).json({error:err})}
            conn.query('select * from users' , (error, response) => {
                conn.release()
                if(error){return res.status(500).json({
                    error:error.sqlMessage})}
                if(response.length === 0){res.status(404).json({message: "Não encontrado"})}
                return res.status(200).json({ 
                    message: "Usuários no banco de dados",
                    users: decrypt(response[1].email),
                    phone: response[1].email
                })
            })
        })
    }
}