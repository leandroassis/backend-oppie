const jwt = require('jsonwebtoken')

const mysql = require('../../mysql').pool
require('dotenv/config')

module.exports ={
    store(req,res){
        mysql.getConnection((err, conn)=>{
            if(err){ return res.status(500).json({error:err})}
            conn.query(`update ${process.env.TABELA1} set confirmed = ? where token = ?`, [true, req.query.token], (error, response)=>{
                if(error){return res.status(500).json({error:error.sqlMessage})}
                return res.status(200).json({
                    message: "Confirmado com sucesso",
                    token: req.query.token
                })
            })
        })
    }
}