const mysql = require('../../mysql').pool
const bcrypt = require('bcrypt')
const encrypt = require('../functions').encrypt
require('dotenv/config')

module.exports = {
    store(req,res){
        mysql.getConnection((err, conn) => {
            if(err){ return res.status(500).json({error:err})}
            const email = encrypt(req.body.email)
            conn.query(`select * from ${process.env.TABELA1} where email = ?`, [email], (error, response)=>{
                conn.release()
                if(error){return res.status(500).json({error:error.sqlMessage})}
                if(response.length < 1){
                    return res.status(401).json({message: "Falha na autenticação"})
                } 
                bcrypt.compare(req.body.password, response[0].password, (errBcrypt, results)=>{
                    if(errBcrypt){
                        return res.status(401).json({message: "Falha na autenticação"})
                    }
                    if(results){
                        return res.status(200).json({message: "Autenticado com sucesso"})
                    }
                    return res.status(401).json({message: "Falha na autenticação"})
                })
            })
        })
    }
}