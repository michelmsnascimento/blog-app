const express = require('express') //01
const router = express.Router() //01
const mongoose = require('mongoose') //02
require("../model/Categoria") //02 faz a requisição da do Categoria.js dentro da pasta models
const Categoria = mongoose.model("categorias") //02 faz a requisição do model categorias

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts',(req, res) => {
    res.send('pagina posts')
})
//lista as categorias em http://localhost:8081/admin/categorias adicionado o .lean
router.get('/categorias',(req, res) => { 
    Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})    
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar categorias")
        res.redirect("/admin")
    })
    
})
//Tela de cadastro de nova categoria redireciona o POST para /categorias/nova
router.get('/categorias/add',(req, res) => { 
    res.render('admin/addcategorias')
})
//Rota para cadastrar no banco de dados o POST do formulario
router.post('/categorias/nova',(req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros, erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso.")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar categotia.")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria:categoria})
    }).catch((e) => {
        console.log(e);
        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/edit',(req, res) => { 
    Categoria.findOne({_id:req.body.id}).lean().then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "categoria editada com sucesso.")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar edicao de categotia.")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar categotia.")
        res.redirect("/admin/categorias")
    })
})

module.exports = router 
//01 exporta para o servidor o router da admin