const express = require('express')
const app = express()
const cors = require('cors')
// const Db = require('./modules/Db')
const Routers = require('./modules/routers/index')

const { cripto } = require('cripto')

console.log('encriptado', encriptado)

console.log('desencriptado', texto)

app.use(cors())
app.use(express.json())
app.use('/', Routers)

app.listen(8080, () => console.log('server rodando em localhost:8080'))