const mysql = require('../../mysql').pool

module.exports = {
    store(req,res){
        mysql.getConnection((err, conn)=>{
            if(err){return res.status(500).json({error:err})}
            conn.query(`select phone_confirmed from ${process.env.TABELA1} where id_user = ?`, [req.body.id], (error, response)=>{
                if(error){return res.status(500).json({error:error})}
                if(response[0].phone_confirmed == req.body.code){
                    conn.query(`update ${process.env.TABELA1} set phone_confirmed = ? where id_user = ?`, [1, req.body.id], (error)=>{
                        conn.release()
                        if(error){return res.status(500).json({error:error.sqlMessage})}
                        return res.status(200).json({
                            message: "Confirmado com sucesso",
                        })
                    })
                }
                else{return res.status(404).json({error:"Código Inválido"})}
            })
        })
    }
}