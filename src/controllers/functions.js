const crypto = require('crypto')
const nodemailer = require('nodemailer')
const TextMessageService = require('comtele-sdk').TextMessageService

require('dotenv/config')

module.exports = {
    // função para encriptar dados sensiveis
    encrypt(value) {
        const cypher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV);
        var encrypted = cypher.update(value, 'utf-8', process.env.CRYPTO_BASE)
        return encrypted += cypher.final(process.env.CRYPTO_BASE)
    },
    // função para descriptar dados sensiveis
    decrypt(value) {
        const decypher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_PASSWORD, process.env.CRYPTO_IV)
        var decrypted = decypher.update(value, process.env.CRYPTO_BASE, 'utf-8')
        decrypted += decypher.final('utf-8')
        return decrypted
    },
    // função que faz o envio do email de verificação
    confirmEmail(email, emailToken) {
        const url = `http://localhost:3333/confirmation/email/?token=${emailToken}`

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            replyTo: "assissantosleandro@gmail.com",
            subject: "OPPIE Confirmação de e-mail",
            html: `<h2>Obrigado por usar nosso serviço!</h2>
            <b>Clique nesse <a href="${url}">link</a> para confirmar sua senha.</b>`
        }).then(info => {
            console.log(info)
        }).catch(email_error => {
            console.log(email_error)
        })
    },
    confirmPhone(phone) {
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();
        const apiKey = process.env.SMS_API_KEY

        var textMessageService = new TextMessageService(apiKey);
        textMessageService.send(
            `Teste APi Código de Verificação ${code}`,   // Content: Conteudo da mensagem a ser enviada.
            phone,  // Receivers: Numero de telefone que vai ser enviado o SMS.
            (result) => console.log(result));
    }
}