const express = require('express')
const routes = express.Router()

const cadastrarUser = require('./controllers/users/cadastro')
const logarUser = require('./controllers/users/login')
const listarUsers = require('./controllers/users/listar')

routes.post('/users/cadastro', cadastrarUser.store)
routes.post('/users/login', logarUser.store)
routes.get('/', listarUsers.store)

module.exports = routes;