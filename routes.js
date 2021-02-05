const express = require('express')
const routes = express.Router()

const cadastrarUser = require('./controllers/cadastro')

routes.post('/cadastro', cadastrarUser.store)

module.exports = routes