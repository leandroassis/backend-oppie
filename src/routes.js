const express = require('express')
const routes = express.Router()

/*
To do Rota de confirmação de telefone
To do Cadastro/Login com redes sociais
*/

const cadastrarUser = require('./controllers/users/cadastro')
const logarUser = require('./controllers/users/login')
const listarUsers = require('./controllers/users/listar')
const confirmEmail = require('./controllers/confirmation/confirmEmail')
const confirmPhone = require('./controllers/confirmation/confirmPhone')

routes.post('/users/cadastro', cadastrarUser.store)
routes.post('/users/login', logarUser.store)
routes.get('/', listarUsers.store)

routes.get('/confirmation/email', confirmEmail.store)
routes.get('/confirmation/phone', confirmPhone.store)


module.exports = routes;