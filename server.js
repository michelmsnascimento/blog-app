//carregar modulos
const express = require('express') //01
const handlebars = require('express-handlebars') //01
const bodyParser = require('body-parser') //01
const server = express() //01
const PORT = 8081 //01
const admin = require('./routes/admin') //01
const path = require('path') //01
const mongoose = require('mongoose') //02

//configurações
    //bodyParser
    server.use(bodyParser.urlencoded({extended: true})) //01
    server.use(bodyParser.json()) //01
    //Handlebars
    server.engine('handlebars', handlebars({defaultLayout: 'main'})) //01
    server.set('view engine', 'handlebars') //01
    //mongoose //02
    mongoose.connect("mongodb://localhost/blogapp", { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then(() => {
        console.log("connect MongoDB success")
    }).catch((erro) => {
        mongoose.Promise = global.Promise
        console.log("Error Connect for MongoDB" + erro)
    })

    //Public //01
    server.use(express.static(path.join(__dirname, "public")))

//Rotas
//Rota do usuario //01
server.get('/', (req, res) => { 
    req.send('rota principal')
})

server.get('/posts', (req, res) => {
    req.send('rota posts') 
})

//Rota do administrador routs admin.js
server.use('/admin', admin) //01

//Outros //01
server.listen(PORT, () => { 
    console.log(`Servidor rodando em localhost:${PORT}`)
})