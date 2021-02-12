const confirmPhone = require('../functions').confirmPhone

module.exports = {
    store(req, res){
        let code = confirmPhone(req.body.phone)
        return res.status(202).json({
            message:"Código Enviado"
        })
    }
}