//carregar modulos
const express = require('express') //01
const handlebars = require('express-handlebars') //01
const bodyParser = require('body-parser') //01
 //01
const PORT = 8081 //01
const admin = require('./routes/admin') //01
const path = require('path') //01
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash") 

const server = express()
//configurações
    //Sessão
    //Tudo que tiver app.use é um middleware
    server.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true 
    }))
    //flash
    server.use(flash())
    //Middleware
    server.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg"),
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })
    //bodyParser
    server.use(bodyParser.urlencoded({extended: false}))
    server.use(bodyParser.json())
    
    //Handlebars
    server.engine('handlebars', handlebars({defaultLayout: 'main'}))
    server.set('view engine', 'handlebars')
    //mongoose //02
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blogapp", { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then(() => {
        console.log("connect MongoDB success")
    }).catch((erro) => {
        
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