const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')

module.exports = {
    store(req,res){
        mysql.getConnection((err, conn) => {
            if(err){ return res.status(500).json({error:err})}
            conn.query('select * from users where email =  ?', [req.body.email], (error,response)=>{
                if(error){return res.status(500).json({
                    error:error.sqlMessage})}
                if(response.length > 0){
                    res.status(409).json({message: "Usuário já cadastrado"})
                } else{
                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash)=>{
                        if(errBcrypt){return res.status(500).json({error:errBcrypt})}
                        conn.query('insert into users (name,email,password,phone) values (?,?,?,?)',
                        [req.body.name,req.body.email,hash,req.body.phone],
                        (error) => {
                        conn.release()
                        if(error){return res.status(500).json({
                            error:error.sqlMessage})}
                        return res.status(201).json({
                            message: "Criado com sucesso"})
                    })})
                }
            })
            
        })
    } 
}