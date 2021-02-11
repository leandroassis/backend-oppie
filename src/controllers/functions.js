const crypto = require('crypto')

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
    }
}