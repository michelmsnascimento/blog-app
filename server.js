//carregar modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const server = express()
const PORT = 8081
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')

//configurações
    //bodyParser
    server.use(bodyParser.urlencoded({extended: true}))
    server.use(bodyParser.json())
    //Handlebars
    server.engine('handlebars', handlebars({defaultLayout: 'main'}))
    server.set('view engine', 'handlebars')
    //mongoose
    
    mongoose.connect("mongodb://localhost/blogapp", {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then(() => {
        console.log("connect MongoDB success")
    }).catch((erro) => {
        mongoose.Promise = global.Promise
        console.log("Error Connect for MongoDB" + erro)
    })
    //public
    server.use(express.static(path.join(__dirname, "public")))

//Rotas

server.get('/', (req, res) => {
    req.send('rota principal')
})

server.get('/posts', (req, res) => {
    req.send('rota posts')
})


server.use('/admin', admin)

//Outros
server.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`)
})