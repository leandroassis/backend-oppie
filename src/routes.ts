import "express";
import {  } from "express";
import {  } from "module";
import {  } from "module";
import {  } from "module";
import {  } from "module";
import {  } from "module";
import {  } from "module";

const routes = express.Router()

const cadastrarUser = require('./controllers/users/Register')
const logarUser = require('./controllers/users/Login')
const listarUsers = require('./controllers/users/ListUsers')
const confirmEmail = require('./controllers/confirmation/ConfirmEmail')
const requestconfirmPhone = require('./controllers/confirmation/RequestConfirmPhone')
const confirmPhone = require('./controllers/confirmation/ConfirmCode')


routes.post('/users/cadastro', cadastrarUser.store)
routes.post('/users/login', logarUser.store)
routes.get('/', listarUsers.store)

routes.get('/confirmation/email', confirmEmail.store)
routes.get('/confirmation/request_code', requestconfirmPhone.store)
routes.get('/confirmation/confirm_code', confirmPhone.store)

module.exports = routes;