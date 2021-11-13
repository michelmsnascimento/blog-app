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
require("./model/Postagem")
const Postagem = mongoose.model("postagens")
require("./model/Categoria")
const Categoria = mongoose.model("categorias")  

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
    Postagem.find().populate("categoria").lean().sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((err)=> {
        req.flash("error_msg","Houve um erro interno")
        req.redirect("/404")
    })
})
server.get("/postagens/:slug", (req, res)=>{
    Postagem.findOne({slug:req.params.slug}).lean().then((postagens) => {
        if(postagens){
            res.render("postagens/index", {postagens: postagens})
        }else{
            req.flash("error_msg","Postagem não ecxite")
            res.redirect("/")
        }
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

server.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})    
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar formulário")
        res.redirect("/")
    })
})

server.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({_slug: req.params.slug}).lean().then((categorias)=>{
        if(categorias){

            Postagem.find({categorias: categorias.id}).lean().then((postagens)=>{
                res.render("categorias/postagens", {postagens: postagens, categorias: categorias})

            }).catch((err) => {
                 req.flash("error_msg", "Erro ao listar oo carregar a pagina desta categortia")
                 req.redirect("/")
            })

        }else{
            req.flash("error_msg", "Essa categoria não existe.")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar pagina categoria")
        req.redirect("/")
    })
})




server.get("/404", (req, res) => {
    res.send('Erro 404!')
})
server.get("/posts", (req, res) => {
    res.send('Lista Posts')
})




//Rota do administrador routs admin.js
server.use('/admin', admin) //01

//Outros //01
server.listen(PORT, () => { 
    console.log(`Servidor rodando em localhost:${PORT}`)
})