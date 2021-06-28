const express = require('express')
const routes = express.Router()

/*
To do Rota de confirmação de telefone
To do Cadastro/Login com redes sociais
*/

const cadastrarUser = require('./Controllers/users/Register')
const logarUser = require('./Controllers/users/Login')
const listarUsers = require('./Controllers/users/ListUsers')
const confirmEmail = require('./Controllers/confirmation/ConfirmEmail')
const requestconfirmPhone = require('./Controllers/confirmation/RequestConfirmPhone')
const confirmPhone = require('./Controllers/confirmation/ConfirmCode')


routes.post('/users/cadastro', cadastrarUser.store)
routes.post('/users/login', logarUser.store)
routes.get('/', listarUsers.store)

routes.get('/confirmation/email', confirmEmail.store)
routes.get('/confirmation/request_code', requestconfirmPhone.store)
routes.get('/confirmation/confirm_code', confirmPhone.store)

module.exports = routes;