const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv/config')

module.exports = {
    encrypt(value){
        const cypher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV);
        if(value){
            var encrypted = cypher.update(value, 'utf-8', process.env.CRYPTO_BASE)
            return encrypted += cypher.final(process.env.CRYPTO_BASE)}
        else{
            return null
        }
    },
    decrypt(value){
        const decypher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV)
        var decrypted = decypher.update(value, process.env.CRYPTO_BASE, 'utf-8')
        decrypted += decypher.final('utf-8')
        return decrypted
    },
    confirmEmail(id, email){
        const emailToken = jwt.sign({
            id_usuario: id
        }, process.env.JWT_SECRET,
        {
            expiresIn: '8h'
        })

        const url = `http://localhost:3333/confirmation/${emailToken}`

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            replyTo: "assissantosleandro@gmail.com",
            subject: "Testando envio de emails da api",
            html: `<b>Ola esse é um email teste</b>
            <h2>Clique no link abaixo para confirmar sua senha</h2>
            <a href="${url}">${url}</a>
            <p>Não adianta clicar, é só um teste :p</p>
            `
        }).then(info =>{
            console.log(info)
        }).catch(errp =>{
            console.log(errp)
        })
    }
}