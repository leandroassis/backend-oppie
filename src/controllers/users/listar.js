const mysql = require('../../mysql').pool
const crypto = require('crypto')
require('dotenv/config')

function decrypt(value){
    const decypher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV)
    var decrypted = decypher.update(value, process.env.CRYPTO_BASE, 'utf-8')
    decrypted += decypher.final('utf-8')
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
                    phone: response
                })
            })
        })
    }
}