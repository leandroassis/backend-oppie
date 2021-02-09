const express = require('express')
const routes = express.Router()

const cadastrarUser = require('./controllers/cadastro')
const listarUsers = require('./controllers/listar')

routes.post('/cadastro', cadastrarUser.store)
routes.get('/', listarUsers.store)

module.exports = routes